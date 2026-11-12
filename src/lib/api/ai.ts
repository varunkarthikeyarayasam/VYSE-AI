// ============================================================================
// VYSE CAMPUS AI — ORCHESTRATION & LLM PIPELINE
// Integrates Google Gemini API with Sathyabama Regulations RAG & Multilingual Handling
// ============================================================================

import { callGeminiApi, isGeminiConfigured, type ChatMessageContext } from "./geminiClient";
import {
  searchSathyabamaRegulations,
  generateGroundedRegulationResponse,
  logUnmatchedQuery,
} from "../rag/ragEngine";
import type { DocumentChunk } from "../rag/sathyabamaDocuments";
import type { SupportedLanguage } from "../i18n/responses";

export interface ChatResponse {
  success: boolean;
  reply: string;
  session_id?: string;
  intent: string;
  entities?: Record<string, any>;
  tool_calls: Array<{ tool: string; status: string; query?: string }>;
  action_card?: any;
  citations?: Array<{ id: string; title: string; category: string; source: string; section?: string }>;
  source?: "gemini" | "grounded_rag" | "guardrail_refusal";
  modelUsed?: string;
}

// ----------------------------------------------------------------------------
// 1. Strict Multilingual and Institutional Grounding System Prompt
// ----------------------------------------------------------------------------
export const VYSE_SYSTEM_PROMPT = `
You are VYSE AI, the official, intelligent, and highly knowledgeable Campus Assistant for Sathyabama Institute of Science and Technology (Deemed to be University, Chennai, India).

### CRITICAL MULTILINGUAL MANDATE (STRICTLY ENFORCED):
Always detect the language of the user's most recent message and respond entirely in that same language and script. Do this regardless of what language previous messages in the conversation were in — always match the language of the latest message, not the first one.

- If the user writes in Tamil, respond entirely in Tamil script (தமிழ்).
- If the user writes in Telugu, respond entirely in Telugu script (తెలుగు).
- If the user writes in Hindi, respond entirely in Devanagari script (हिन्दी).
- If the user writes in English, respond in English.
- Do not transliterate into Latin/English script unless the user's own message was written in Latin script (e.g. Tamil typed using English letters like "vanakkam eppadi irukinga") — in that case, mirror their choice and respond the same way.
- If the user's message mixes two languages, respond in whichever language makes up the majority of their message.
- Never default to English unless the user's message was in English or you genuinely cannot identify the language.

### INSTITUTIONAL GROUNDING & ACCURACY:
- You are provided with official university document excerpts (Library Rules, Academic Regulations 2023, PG Credit System, Student Handbook 2025-26, and B.E. CSE Curriculum).
- When answering questions about university policies, fees, attendance requirements, exams, bus schedules, or dress codes, you MUST base your answer strictly on the provided official excerpts and cite the official document and clause/section.
- Never fabricate rules, fees, dates, or contact emails.
- If the user's inquiry is outside the scope of campus life or university regulations (such as cooking recipes, film gossip, world sports results, or random non-academic trivia), you MUST politely refuse to answer and recommend contacting the Student Help Desk at studenthelpdesk@sathyabama.ac.in, writing in the user's matching language and script.
`.trim();

// ----------------------------------------------------------------------------
// 2. Main Chat Orchestrator (Gemini API + Grounded RAG Fallback)
// ----------------------------------------------------------------------------
export async function executeAiChat(params: {
  message: string;
  conversationHistory: Array<{ role: "user" | "assistant"; content: string }>;
  studentContext?: {
    name: string;
    rollNumber: string;
    department: string;
    attendance: number;
    homeLocation: string;
  };
  language: SupportedLanguage;
}): Promise<ChatResponse> {
  const query = params.message.trim();
  const lang = params.language;

  // 1. Search verified official Sathyabama Regulations
  const { results: matchedChunks, topScore } = searchSathyabamaRegulations(query, {
    topK: 3,
    minScore: 0.28,
  });

  const citations = matchedChunks.map((c) => ({
    id: c.chunk.id,
    title: c.chunk.title,
    category: c.chunk.category,
    source: c.chunk.document,
    section: c.chunk.section,
  }));

  // 2. If Gemini API Key is configured, execute real LLM call
  if (isGeminiConfigured()) {
    try {
      console.log("[VYSE AI] Calling Gemini API backend...");

      // Prepare context string from retrieved chunks
      let contextInstruction = "";
      if (matchedChunks.length > 0) {
        contextInstruction = `\n\n### VERIFIED OFFICIAL UNIVERSITY DOCUMENT EXCERPTS:\n` +
          matchedChunks
            .map((m, idx) => `[Source ${idx + 1}: ${m.chunk.document} — ${m.chunk.section}]\n${m.chunk.content}`)
            .join("\n\n");
      }

      // Add student profile context
      let studentInstruction = "";
      if (params.studentContext) {
        studentInstruction = `\n\n### ACTIVE STUDENT PROFILE:\n` +
          `Name: ${params.studentContext.name}\n` +
          `Roll Number: ${params.studentContext.rollNumber}\n` +
          `Department: ${params.studentContext.department}\n` +
          `Current Attendance: ${params.studentContext.attendance}%\n` +
          `Boarding Point: ${params.studentContext.homeLocation}`;
      }

      const fullSystemInstruction = `${VYSE_SYSTEM_PROMPT}${studentInstruction}${contextInstruction}`;

      // Build conversation history (last 8 turns for contextual awareness)
      const messagesForApi: ChatMessageContext[] = params.conversationHistory
        .slice(-8)
        .map((m) => ({ role: m.role, content: m.content }));

      // Append current user message
      messagesForApi.push({ role: "user", content: query });

      const geminiResult = await callGeminiApi({
        messages: messagesForApi,
        systemInstruction: fullSystemInstruction,
        temperature: 0.2,
      });

      if (geminiResult.success && geminiResult.text) {
        return {
          success: true,
          reply: geminiResult.text,
          intent: matchedChunks.length > 0 ? "grounded_regulation" : "general_inquiry",
          tool_calls: [
            { tool: `call_gemini_api('${geminiResult.model}')`, status: "completed" },
            { tool: `retrieve_official_chunks(${matchedChunks.length})`, status: "completed" },
          ],
          citations: citations.length > 0 ? citations : undefined,
          source: "gemini",
          modelUsed: geminiResult.model,
        };
      }

      console.warn("[VYSE AI] Gemini call returned error:", geminiResult.error);
    } catch (err) {
      console.error("[VYSE AI] Exception calling Gemini API:", err);
    }
  }

  // 3. Deterministic Grounded RAG Engine Fallback
  // If Gemini API is not configured or fails, use our verified RAG engine
  console.log("[VYSE AI] Executing offline-resilient Grounded RAG engine...");
  const ragResponse = generateGroundedRegulationResponse(query, lang);

  if (ragResponse.success && !ragResponse.refused) {
    return {
      success: true,
      reply: ragResponse.reply,
      intent: "grounded_regulation",
      tool_calls: [
        { tool: "sathyabama_grounded_rag_retrieval()", status: "completed" },
      ],
      citations: ragResponse.citations,
      source: "grounded_rag",
    };
  }

  // 4. Out-of-Domain / Negative Refusal
  logUnmatchedQuery(query, topScore, "out_of_domain");
  return {
    success: false,
    reply: ragResponse.reply,
    intent: "out_of_domain_refusal",
    tool_calls: [
      { tool: "institutional_scope_guardrail_check()", status: "completed" },
    ],
    citations: [
      {
        id: "g1",
        title: "Institutional Scope & Safety Policy",
        category: "System",
        source: "Sathyabama Code of Ethics",
      },
    ],
    source: "guardrail_refusal",
  };
}

// Re-export sendChatMessage for backwards compatibility
export async function sendChatMessage(params: {
  message: string;
  sessionId?: string;
  studentId?: string;
  language?: "en" | "ta" | "te" | "hi";
  systemPrompt?: string;
}): Promise<ChatResponse> {
  return executeAiChat({
    message: params.message,
    conversationHistory: [],
    language: params.language || "en",
  });
}