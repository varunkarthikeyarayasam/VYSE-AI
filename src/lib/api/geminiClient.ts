// ============================================================================
// VYSE CAMPUS AI — GEMINI LLM API CLIENT
// Reusable, production-grade Gemini integration with conversation history,
// timeout handling, model failover, and detailed error classification.
// ============================================================================

export interface ChatMessageContext {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface GeminiCallOptions {
  messages: ChatMessageContext[];
  systemInstruction?: string;
  temperature?: number;
  maxOutputTokens?: number;
  timeoutMs?: number;
  model?: string;
}

export interface GeminiCallResult {
  success: boolean;
  text: string;
  model: string;
  error?: {
    code: "KEY_MISSING" | "RATE_LIMITED" | "TIMEOUT" | "NETWORK_ERROR" | "API_ERROR";
    message: string;
    details?: any;
  };
}

// Candidate sequence of active Gemini models (verified for high availability in 2026)
const CANDIDATE_MODELS = [
  "gemini-3.5-flash",
  "gemini-3.5-flash-lite",
  "gemini-flash-lite-latest",
  "gemini-3.6-flash",
  "gemini-flash-latest",
];


export function getGeminiApiKey(): string {
  // 1. Check browser localStorage (allowing on-the-fly UI entry without restart)
  if (typeof window !== "undefined" && window.localStorage) {
    const localKey = localStorage.getItem("vyse_gemini_api_key");
    if (localKey && localKey.trim().length > 5) {
      return localKey.trim().replace(/^["']|["']$/g, "");
    }
  }

  // 2. Check Vite client-side environment variable (.env) or Node environment
  const proc = typeof globalThis !== "undefined" ? (globalThis as any).process : undefined;
  const key = (import.meta as any).env?.VITE_GEMINI_API_KEY ||
    proc?.env?.VITE_GEMINI_API_KEY ||
    proc?.env?.GEMINI_API_KEY ||
    "";
  return (key || "").replace(/^["']|["']$/g, "").trim();
}


export function setGeminiApiKey(key: string): void {
  if (typeof window !== "undefined" && window.localStorage) {
    localStorage.setItem("vyse_gemini_api_key", key.replace(/^["']|["']$/g, "").trim());
    console.log("[VYSE GEMINI] Stored Gemini API key to localStorage.");
  }
}

export function isGeminiConfigured(): boolean {
  const key = getGeminiApiKey();
  return Boolean(key && key !== "YOUR_GEMINI_API_KEY" && key !== '""' && key.length > 5);
}


/**
 * Sends conversation history and instructions to Google Gemini API
 */
export async function callGeminiApi(options: GeminiCallOptions): Promise<GeminiCallResult> {
  const apiKey = getGeminiApiKey();

  if (!apiKey || apiKey === "YOUR_GEMINI_API_KEY" || apiKey === '""') {
    console.warn("[VYSE GEMINI] Missing VITE_GEMINI_API_KEY in .env file.");
    return {
      success: false,
      text: "",
      model: "none",
      error: {
        code: "KEY_MISSING",
        message: "Gemini API key is not configured. Please add VITE_GEMINI_API_KEY to your .env file.",
      },
    };
  }

  const timeoutMs = options.timeoutMs ?? 15000;
  const temperature = options.temperature ?? 0.3;
  const preferredModel = options.model || CANDIDATE_MODELS[0];

  // Convert incoming messages into Gemini contents format
  // Filter out system messages since Gemini takes systemInstruction separately
  const contents = options.messages
    .filter((m) => m.role === "user" || m.role === "assistant")
    .map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

  // Ensure there's at least one message
  if (contents.length === 0) {
    return {
      success: false,
      text: "Empty conversation payload",
      model: preferredModel,
      error: {
        code: "API_ERROR",
        message: "No user or assistant messages provided to Gemini API.",
      },
    };
  }

  const payload: Record<string, any> = {
    contents,
    generationConfig: {
      temperature,
      maxOutputTokens: options.maxOutputTokens ?? 2048,
      topP: 0.95,
    },
  };

  if (options.systemInstruction) {
    payload.systemInstruction = {
      parts: [{ text: options.systemInstruction }],
    };
  }

  // Try candidate models in order if needed
  const modelsToTry = [preferredModel, ...CANDIDATE_MODELS.filter((m) => m !== preferredModel)];

  for (const modelName of modelsToTry) {
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
      console.log(`[VYSE GEMINI] Requesting ${modelName} (${contents.length} turns, temp=${temperature})...`);

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        const candidate = data.candidates?.[0];
        const generatedText = candidate?.content?.parts?.[0]?.text;

        if (generatedText && generatedText.trim().length > 0) {
          console.log(`[VYSE GEMINI] Success with ${modelName} (Finish: ${candidate.finishReason || "STOP"})`);
          return {
            success: true,
            text: generatedText.trim(),
            model: modelName,
          };
        } else {
          console.warn(`[VYSE GEMINI] Model ${modelName} returned empty text parts:`, data);
          return {
            success: false,
            text: "",
            model: modelName,
            error: {
              code: "API_ERROR",
              message: "Gemini returned an empty completion or safety block.",
              details: data,
            },
          };
        }
      }

      // Handle non-200 responses
      const errorJson = await response.json().catch(() => ({}));
      const statusCode = response.status;
      const apiErrMsg = errorJson.error?.message || `HTTP ${statusCode}`;
      console.error(`[VYSE GEMINI] Error from ${modelName} (Status ${statusCode}):`, apiErrMsg);

      const hasNextModel = modelsToTry.indexOf(modelName) < modelsToTry.length - 1;

      if (hasNextModel) {
        console.warn(`[VYSE GEMINI] Model ${modelName} returned status ${statusCode}. Trying next candidate model...`);
        continue;
      }

      if (statusCode === 429) {
        return {
          success: false,
          text: "",
          model: modelName,
          error: {
            code: "RATE_LIMITED",
            message: "Gemini API rate limit reached. Please wait a moment and retry.",
            details: errorJson,
          },
        };
      }

      return {
        success: false,
        text: "",
        model: modelName,
        error: {
          code: "API_ERROR",
          message: `Gemini API error (${statusCode}): ${apiErrMsg}`,
          details: errorJson,
        },
      };
    } catch (err: any) {
      clearTimeout(timeoutId);

      const hasNextModel = modelsToTry.indexOf(modelName) < modelsToTry.length - 1;
      if (hasNextModel) {
        console.warn(`[VYSE GEMINI] Model ${modelName} failed (${err.message}). Trying next candidate model...`);
        continue;
      }

      if (err.name === "AbortError" || controller.signal.aborted) {
        console.error(`[VYSE GEMINI] Timeout after ${timeoutMs}ms with ${modelName}`);
        return {
          success: false,
          text: "",
          model: modelName,
          error: {
            code: "TIMEOUT",
            message: `Gemini API request timed out after ${timeoutMs / 1000} seconds.`,
          },
        };
      }

      console.error(`[VYSE GEMINI] Network or fetch error with ${modelName}:`, err);
      return {
        success: false,
        text: "",
        model: modelName,
        error: {
          code: "NETWORK_ERROR",
          message: err.message || "Failed to reach Google Gemini API servers. Check your internet connection.",
          details: err,
        },
      };
    }
  }

  return {
    success: false,
    text: "",
    model: "none",
    error: {
      code: "API_ERROR",
      message: "All candidate Gemini models failed to respond.",
    },
  };
}
