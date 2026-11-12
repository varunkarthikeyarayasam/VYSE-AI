/**
 * Optional Whisper API STT Fallback Service
 * Uses OpenAI Whisper (whisper-1) if VITE_OPENAI_API_KEY is configured in .env
 */

export async function transcribeWithWhisper(audioBlob: Blob, languageHint?: string): Promise<string> {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OpenAI API key not configured for Whisper fallback.");
  }

  const formData = new FormData();
  formData.append("file", audioBlob, "audio.webm");
  formData.append("model", "whisper-1");
  if (languageHint && languageHint !== "auto") {
    formData.append("language", languageHint);
  }

  const response = await fetch("https://api.openai.com/v1/audio/transcriptions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `Whisper API failed with status ${response.status}`);
  }

  const data = await response.json();
  return data.text || "";
}

export function isWhisperConfigured(): boolean {
  return Boolean(import.meta.env.VITE_OPENAI_API_KEY);
}
