// ============================================================================
// SATHYABAMA UNIVERSITY RAG ENGINE
// High-Speed Hybrid Vector & Lexical Retrieval with Strict Grounding Guardrails
// ============================================================================

import { SATHYABAMA_OFFICIAL_DOCUMENTS, type DocumentChunk } from "./sathyabamaDocuments";
import type { SupportedLanguage } from "../i18n/responses";

export interface SearchResult {
  chunk: DocumentChunk;
  score: number;
  matchedKeywords: string[];
}

export interface RagResponse {
  success: boolean;
  refused: boolean;
  reply: string;
  citations: Array<{
    id: string;
    title: string;
    category: string;
    source: string;
    section?: string;
  }>;
  topScore: number;
  matchedChunks: DocumentChunk[];
}

// ----------------------------------------------------------------------------
// 1. Audit Logger for Unmatched / Out-of-Domain Queries
// ----------------------------------------------------------------------------
export interface AuditLogEntry {
  id: string;
  query: string;
  timestamp: string;
  topScore: number;
  reason: "below_threshold" | "out_of_domain";
}

const AUDIT_STORAGE_KEY = "vyse_unmatched_query_audit";

export function logUnmatchedQuery(query: string, topScore: number, reason: "below_threshold" | "out_of_domain" = "below_threshold") {
  try {
    const entry: AuditLogEntry = {
      id: `audit-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      query,
      timestamp: new Date().toISOString(),
      topScore,
      reason,
    };
    const existing: AuditLogEntry[] = JSON.parse(localStorage.getItem(AUDIT_STORAGE_KEY) || "[]");
    existing.unshift(entry);
    localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(existing.slice(0, 100)));
    console.warn(`[VYSE RAG AUDIT] Unmatched query logged (${reason}, score: ${topScore.toFixed(3)}): "${query}"`);
  } catch (e) {
    // Ignore storage issues in SSR / non-browser test runs
  }
}

export function getUnmatchedAuditLog(): AuditLogEntry[] {
  try {
    return JSON.parse(localStorage.getItem(AUDIT_STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

// ----------------------------------------------------------------------------
// 2. Tokenization & Vector Space Representation
// ----------------------------------------------------------------------------
const STOP_WORDS = new Set([
  "a", "an", "the", "in", "on", "at", "to", "for", "of", "and", "or", "is",
  "are", "was", "were", "be", "been", "by", "what", "how", "why", "when",
  "who", "which", "where", "can", "could", "should", "would", "do", "does",
  "did", "have", "has", "had", "my", "your", "his", "her", "their", "our",
  "i", "you", "he", "she", "it", "we", "they", "me", "him", "us", "them",
  "tell", "know", "give", "much", "many", "there", "any", "some"
]);

const MULTILINGUAL_CONCEPT_MAP: Record<string, string[]> = {
  // Library & Books
  "நூலகம்": ["library", "books"],
  "நூலக": ["library", "books"],
  "புத்தகம்": ["book", "books"],
  "புத்தகங்கள்": ["books", "borrow"],
  "கடன்": ["borrow", "loan"],
  "அபராதம்": ["fine", "overdue"],
  "லைப்ரరీ": ["library", "books"],
  "పుస్తకం": ["book", "books"],
  "పుస్తకాలు": ["books", "borrow"],
  "పుస్తక": ["books", "borrow"],
  "రుణం": ["borrow", "loan"],
  "ఫైన్": ["fine", "overdue"],
  "పుస్తकालय": ["library", "books"],
  "किताब": ["book", "books"],
  "किताबें": ["books", "borrow"],
  "उधार": ["borrow", "loan"],
  "जुर्माना": ["fine", "overdue"],

  // Attendance & OD
  "வருகை": ["attendance", "80%"],
  "வருகைப்": ["attendance", "80%"],
  "விடுப்பு": ["leave", "od"],
  "ஹாஜரு": ["attendance", "80%"],
  "హాజరు": ["attendance", "80%"],
  "సెలవు": ["leave", "od"],
  "కనీస": ["minimum", "attendance"],
  "శాతం": ["percentage", "80%"],
  "పరీక్షలు": ["exam", "examination", "ese"],
  "పరీక్ష": ["exam", "examination", "ese"],
  "రాయడానికి": ["write", "appear"],
  "ఉండాలి": ["required"],
  "उपस्थिति": ["attendance", "80%"],
  "हाजिरी": ["attendance", "80%"],
  "छुट्टी": ["leave", "od"],

  // ID Card & Fees
  "அடையாள": ["id", "card"],
  "அட்டை": ["card"],
  "கட்டணம்": ["fee", "fees", "500", "250"],
  "தொலைந்து": ["lost", "damage"],
  "ஐடீ": ["id", "card"],
  "ఐడీ": ["id", "card"],
  "కార్డు": ["card"],
  "ఫీజు": ["fee", "fees", "500", "250"],
  "पहचान": ["id", "card"],
  "कार्ड": ["card"],
  "पत्र": ["card"],
  "फीस": ["fee", "fees", "500", "250"],

  // Exams & Revaluation
  "தேர்வு": ["exam", "examination"],
  "மறுமதிப்பீடு": ["revaluation"],
  "பரீட்சை": ["exam"],
  "పునర్మూల్యాంకనం": ["revaluation"],
  "परीक्षा": ["exam", "examination"],
  "पुनर्मूल्यांकन": ["revaluation"],

  // Bus & Transport
  "பேருந்து": ["bus", "transport"],
  "போக்குவரத்து": ["transport", "bus"],
  "பஸ்": ["bus", "transport"],
  "బస్సు": ["bus", "transport"],
  "రవాణా": ["transport", "bus"],
  "बस": ["bus", "transport"],
  "परिवहन": ["transport", "bus"],

  // Dress code
  "ஆடை": ["dress", "code"],
  "உடை": ["dress", "code"],
  "டிரஸ்": ["dress", "code"],
  "డ్రెస్": ["dress", "code"],
  "ड्रेस": ["dress", "code"],

  // Ragging
  "ராகிங்": ["ragging"],
  "ర్యాగింగ్": ["ragging"],
  "रैगिंग": ["ragging"],
};

function tokenize(text: string): string[] {
  const rawTokens = text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s₹%.-]/gu, " ")
    .split(/\s+/)
    .filter((w) => w.length > 1 && !STOP_WORDS.has(w));

  const expandedTokens = [...rawTokens];
  for (const t of rawTokens) {
    for (const [key, equivalents] of Object.entries(MULTILINGUAL_CONCEPT_MAP)) {
      if (t.includes(key.toLowerCase()) || key.toLowerCase().includes(t)) {
        expandedTokens.push(...equivalents);
      }
    }
  }
  return expandedTokens;
}


// Calculate term frequency map
function getTermFrequency(tokens: string[]): Map<string, number> {
  const tf = new Map<string, number>();
  for (const t of tokens) {
    tf.set(t, (tf.get(t) || 0) + 1);
  }
  return tf;
}

// Compute cosine similarity between two term-frequency vector maps
function cosineSimilarity(tf1: Map<string, number>, tf2: Map<string, number>): number {
  let dotProduct = 0;
  let norm1 = 0;
  let norm2 = 0;

  for (const [term, freq1] of tf1) {
    norm1 += freq1 * freq1;
    const freq2 = tf2.get(term);
    if (freq2) {
      dotProduct += freq1 * freq2;
    }
  }

  for (const [, freq2] of tf2) {
    norm2 += freq2 * freq2;
  }

  if (norm1 === 0 || norm2 === 0) return 0;
  return dotProduct / (Math.sqrt(norm1) * Math.sqrt(norm2));
}

// Pre-compute indexed token maps for all official chunks
interface IndexedChunk {
  chunk: DocumentChunk;
  tf: Map<string, number>;
  keywordsSet: Set<string>;
  rawText: string;
}

const INDEXED_DOCUMENTS: IndexedChunk[] = SATHYABAMA_OFFICIAL_DOCUMENTS.map((chunk) => {
  const rawText = `${chunk.title} ${chunk.section} ${chunk.content} ${chunk.keywords.join(" ")}`;
  const tokens = tokenize(rawText);
  return {
    chunk,
    tf: getTermFrequency(tokens),
    keywordsSet: new Set(chunk.keywords.map((k) => k.toLowerCase())),
    rawText: rawText.toLowerCase(),
  };
});

// ----------------------------------------------------------------------------
// 3. Hybrid Search Algorithm
// ----------------------------------------------------------------------------
export interface SearchOptions {
  topK?: number;
  minScore?: number;
  categoryFilter?: string;
}

export function searchSathyabamaRegulations(
  query: string,
  options: SearchOptions = {}
): { results: SearchResult[]; topScore: number } {
  const topK = options.topK ?? 3;
  const minScore = options.minScore ?? 0.32;
  const queryTokens = tokenize(query);

  if (queryTokens.length === 0) {
    return { results: [], topScore: 0 };
  }

  const queryTf = getTermFrequency(queryTokens);
  const rawQueryLower = query.toLowerCase();

  const scoredResults: SearchResult[] = [];

  for (const doc of INDEXED_DOCUMENTS) {
    if (options.categoryFilter && doc.chunk.category !== options.categoryFilter) {
      continue;
    }

    // A. Dense vector cosine similarity
    const cosScore = cosineSimilarity(queryTf, doc.tf);

    // B. Keyword and lexical overlap boost
    let keywordHits = 0;
    const matchedKeywords: string[] = [];
    for (const token of queryTokens) {
      const isExactToken = doc.tf.has(token) || doc.keywordsSet.has(token);
      const isLongStem = token.length >= 4 && doc.rawText.includes(token);
      if (isExactToken || isLongStem) {
        keywordHits++;
        matchedKeywords.push(token);
      }
    }
    const keywordRatio = queryTokens.length > 0 ? keywordHits / queryTokens.length : 0;

    // C. Exact phrase or code boosts
    let exactBoost = 0;
    // Course codes like SCSB1201, S11BLH11, etc.
    const codeMatches = query.match(/[A-Z0-9]{6,10}/gi);
    if (codeMatches) {
      for (const code of codeMatches) {
        if (doc.rawText.includes(code.toLowerCase())) {
          exactBoost += 0.35;
        }
      }
    }

    // Number & Domain matching with word boundary protections
    if (/\b80%?\b/.test(rawQueryLower) && /\b80%?\b/.test(doc.rawText)) exactBoost += 0.25;
    if (/\b60%?\b/.test(rawQueryLower) && /\b60%?\b/.test(doc.rawText)) exactBoost += 0.20;
    if (/\b500\b/.test(rawQueryLower) && /\b500\b/.test(doc.rawText)) exactBoost += 0.35;
    if (/\b250\b/.test(rawQueryLower) && /\b250\b/.test(doc.rawText)) exactBoost += 0.35;
    if (/\bfine\b/i.test(rawQueryLower) && /\bfine\b/i.test(doc.rawText)) exactBoost += 0.25;
    if (/\blost\b/i.test(rawQueryLower) && /\blost\b/i.test(doc.rawText)) exactBoost += 0.25;
    if (/\bbus\b/i.test(rawQueryLower) && /\bbus\b/i.test(doc.rawText)) exactBoost += 0.20;
    if (/\bdress\b/i.test(rawQueryLower) && /\bdress\b/i.test(doc.rawText)) exactBoost += 0.50;
    if (/\bjeans\b/i.test(rawQueryLower) && /\bjeans\b/i.test(doc.rawText)) exactBoost += 0.50;
    if (/\b(attire|clothes|uniform)\b/i.test(rawQueryLower) && /\b(dress|attire)\b/i.test(doc.rawText)) exactBoost += 0.35;
    if (/\bragging\b/i.test(rawQueryLower) && /\bragging\b/i.test(doc.rawText)) exactBoost += 0.40;
    if (/\brevaluation\b/i.test(rawQueryLower) && /\brevaluation\b/i.test(doc.rawText)) exactBoost += 0.40;
    if (/\bscribe\b/i.test(rawQueryLower) && /\bscribe\b/i.test(doc.rawText)) exactBoost += 0.40;
    if (/\bhonors\b/i.test(rawQueryLower) && /\bhonors\b/i.test(doc.rawText)) exactBoost += 0.30;
    if (/\bminor\b/i.test(rawQueryLower) && /\bminor\b/i.test(doc.rawText)) exactBoost += 0.30;
    if (/\bcurriculum\b/i.test(rawQueryLower) && /\bcurriculum\b/i.test(doc.rawText)) exactBoost += 0.25;
    if (/\bcredits\b/i.test(rawQueryLower) && /\bcredits\b/i.test(doc.rawText)) exactBoost += 0.25;


    // Combined Hybrid Score (Range approx 0.0 to 1.0+)
    const finalScore = (0.55 * cosScore) + (0.35 * keywordRatio) + exactBoost;

    if (finalScore >= minScore) {
      scoredResults.push({
        chunk: doc.chunk,
        score: finalScore,
        matchedKeywords,
      });
    }
  }

  // Sort descending by score
  scoredResults.sort((a, b) => b.score - a.score);

  const topScore = scoredResults.length > 0 ? scoredResults[0].score : 0;
  return {
    results: scoredResults.slice(0, topK),
    topScore,
  };
}

// ----------------------------------------------------------------------------
// 4. Grounded Response Synthesis (Zero-Hallucination + Multilingual)
// ----------------------------------------------------------------------------
export function generateGroundedRegulationResponse(
  query: string,
  lang: SupportedLanguage = "en"
): RagResponse {
  // Check if query is a simple conversational greeting
  const trimmedLower = query.trim().toLowerCase();
  const isGreeting = /^(hi|hello|hey|vanakkam|namaste|namaskaram|good\s+(morning|afternoon|evening)|who\s+are\s+you|what\s+can\s+you\s+do)[\s!.,?]*$/i.test(trimmedLower);
  if (isGreeting) {
    const greetings: Record<SupportedLanguage, string> = {
      en: "Hello! I am **VYSE AI**, your official campus assistant for Sathyabama Institute of Science and Technology. How can I help you today? You can ask me about your attendance, OD requests, exam rules, library guidelines, bus routes, or campus timetables.",
      ta: "வணக்கம்! நான் **VYSE AI**, சத்யபாமா பல்கலைக்கழகத்தின் உங்களின் அதிகாரப்பூர்வ வளாக உதவியாளர். உங்கள் வருகை சதவீதம், OD விண்ணப்பங்கள், தேர்வு விதிமுறைகள், நூலக வழிகாட்டுதல்கள் அல்லது பேருந்து வழித்தடங்கள் பற்றி என்னிடம் கேட்கலாம்!",
      te: "నమస్కారం! నేను **VYSE AI**, సత్యభామ విశ్వవిద్యాలయం యొక్క అధికారిక క్యాంపస్ అసిస్టెంట్. మీ హాజరు, OD అభ్యర్థనలు, పరీక్షల నిబంధనలు లేదా బస్సు మార్గాల గురించి నన్ను అడగవచ్చు!",
      hi: "नमस्ते! मैं **VYSE AI** हूँ, सत्यभामा विश्वविद्यालय का आपका आधिकारिक कैंपस सहायक। उपस्थिति, ओडी (OD) आवेदन, परीक्षा नियम, पुस्तकालय दिशानिर्देश या बस मार्गों के संबंध में मैं आपकी क्या सहायता कर सकता हूँ?",
    };
    return {
      success: true,
      refused: false,
      reply: greetings[lang] || greetings.en,
      citations: [],
      topScore: 1.0,
      matchedChunks: [],
    };
  }

  const { results, topScore } = searchSathyabamaRegulations(query, { topK: 2, minScore: 0.32 });

  // STRICT NEGATIVE REFUSAL if no chunk scores above threshold
  if (results.length === 0 || topScore < 0.32) {
    logUnmatchedQuery(query, topScore, "below_threshold");

    const refusals: Record<SupportedLanguage, string> = {
      en: "I searched the verified institutional knowledge base, but found no verified campus records or university regulations regarding that inquiry. Please verify with the Dean of Academics or Student Help Desk (`studenthelpdesk@sathyabama.ac.in`).",
      ta: "சரிபார்க்கப்பட்ட நிறுவன ஆவணங்களில் உங்கள் வினவலுக்கான பல்கலைக்கழக விதிமுறைகள் எதுவும் கிடைக்கவில்லை. தயவுசெய்து கல்வி முதன்மையர் (Dean of Academics) அல்லது மாணவர் உதவி மையத்தை (`studenthelpdesk@sathyabama.ac.in`) தொடர்பு கொள்ளவும்.",
      te: "ధృవీకరించబడిన విశ్వవిద్యాలయ నిబంధనలలో మీ ప్రశ్నకు సంబంధించిన రికార్డులు ఏవీ కనుగొనబడలేదు. దయచేసి డీన్ ఆఫ్ అకడమిక్స్ లేదా విద్యార్థి సహాయ కేంద్రం (`studenthelpdesk@sathyabama.ac.in`) ను సంప్రదించండి.",
      hi: "सत्यापित विश्वविद्यालय अभिलेखों में आपके प्रश्न से संबंधित कोई नियम या रिकॉर्ड नहीं मिले। कृपया डीन ऑफ एकेडमिक्स या छात्र सहायता केंद्र (`studenthelpdesk@sathyabama.ac.in`) से संपर्क करें।",
    };

    return {
      success: false,
      refused: true,
      reply: refusals[lang] || refusals.en,
      citations: [
        {
          id: "guardrail-0",
          title: "Institutional Scope & Safety Policy",
          category: "System Policy",
          source: "Sathyabama Code of Ethics",
        },
      ],
      topScore,
      matchedChunks: [],
    };
  }

  // Chunks found above threshold: synthesize grounded answer
  const primaryMatch = results[0].chunk;
  const secondaryMatch = results[1]?.chunk;

  const citations = results.map((r) => ({
    id: r.chunk.id,
    title: r.chunk.title,
    category: r.chunk.category,
    source: r.chunk.document,
    section: r.chunk.section,
  }));

  let replyText = "";

  if (lang === "en") {
    replyText = `According to official **${primaryMatch.document}** (${primaryMatch.section}):\n\n` +
      `### ${primaryMatch.title}\n` +
      `${primaryMatch.content}\n\n` +
      (secondaryMatch && secondaryMatch.id !== primaryMatch.id
        ? `**Related Provision — ${secondaryMatch.section}:**\n${secondaryMatch.content}\n\n`
        : "") +
      `📌 *Official Citation: ${primaryMatch.citation}*`;
  } else if (lang === "ta") {
    replyText = `அதிகாரப்பூர்வ **${primaryMatch.document}** (${primaryMatch.section}) விதிகளின்படி:\n\n` +
      `### ${primaryMatch.title}\n` +
      `${primaryMatch.content}\n\n` +
      `📌 *அதிகாரப்பூர்வ மேற்கோள்: ${primaryMatch.citation}*`;
  } else if (lang === "te") {
    replyText = `అధికారిక **${primaryMatch.document}** (${primaryMatch.section}) నిబంధనల ప్రకారం:\n\n` +
      `### ${primaryMatch.title}\n` +
      `${primaryMatch.content}\n\n` +
      `📌 *అధికారిక రిఫరెన్స్: ${primaryMatch.citation}*`;
  } else if (lang === "hi") {
    replyText = `आधिकारिक **${primaryMatch.document}** (${primaryMatch.section}) के अनुसार:\n\n` +
      `### ${primaryMatch.title}\n` +
      `${primaryMatch.content}\n\n` +
      `📌 *आधिकारिक संदर्भ: ${primaryMatch.citation}*`;
  }

  return {
    success: true,
    refused: false,
    reply: replyText,
    citations,
    topScore,
    matchedChunks: results.map((r) => r.chunk),
  };
}
