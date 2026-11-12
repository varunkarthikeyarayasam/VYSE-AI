// ============================================================================
// SATHYABAMA RAG PIPELINE TEST SUITE & VERIFICATION CHECKLIST
// Run via: npx tsx scripts/test-rag.ts
// ============================================================================

import { searchSathyabamaRegulations, generateGroundedRegulationResponse } from "../src/lib/rag/ragEngine";

interface TestCase {
  name: string;
  query: string;
  expectedRefusal: boolean;
  expectedCitationSnippet?: string;
  expectedKeywords?: string[];
  language?: "en" | "ta" | "te" | "hi";
}

const TEST_CASES: TestCase[] = [
  {
    name: "1. Library Borrow Limit & Overdue Fine",
    query: "How many library books can I borrow and what is the fine for late return?",
    expectedRefusal: false,
    expectedCitationSnippet: "Central Library Rules & Regulations",
    expectedKeywords: ["four books", "30 days", "re. 1"],
  },
  {
    name: "2. Exam Attendance Requirement & Condonation",
    query: "What is the minimum attendance required to write semester exams, and can I get condonation?",
    expectedRefusal: false,
    expectedCitationSnippet: "Academic Regulations 2023, Clause 22.2",
    expectedKeywords: ["80%", "60%", "dean (student affairs)"],
  },
  {
    name: "3. Lost ID Card Replacement Fee",
    query: "What is the fee if I lose my ID card?",
    expectedRefusal: false,
    expectedCitationSnippet: "Student Handbook 2025-26",
    expectedKeywords: ["500", "250", "help desk"],
  },
  {
    name: "4. Project Revaluation Restriction",
    query: "Can I apply for revaluation of my final semester project work?",
    expectedRefusal: false,
    expectedCitationSnippet: "Academic Regulations 2023, Clause 21.2",
    expectedKeywords: ["theory", "not permitted for practical courses and for project work"],
  },
  {
    name: "5. Multilingual Query (Tamil) - Library Rules",
    query: "நூலகத்தில் எத்தனை புத்தகங்கள் கடன் வாங்கலாம்?",
    language: "ta",
    expectedRefusal: false,
    expectedCitationSnippet: "Central Library Rules & Regulations",
  },
  {
    name: "6. Multilingual Query (Telugu) - Attendance Rules",
    query: "సెమిస్టర్ పరీక్షలు రాయడానికి కనీస హాజరు ఎంత శాతం ఉండాలి?",
    language: "te",
    expectedRefusal: false,
    expectedCitationSnippet: "Academic Regulations 2023",
  },
  {
    name: "7. Multilingual Query (Hindi) - ID Card Fee",
    query: "खोए हुए पहचान पत्र (ID कार्ड) की फीस कितनी है?",
    language: "hi",
    expectedRefusal: false,
    expectedCitationSnippet: "Student Handbook 2025-26",
  },
  {
    name: "8. Dress Code & Prohibited Attire",
    query: "What is the dress code for students and are torn jeans allowed?",
    expectedRefusal: false,
    expectedCitationSnippet: "Student Handbook 2025-26",
    expectedKeywords: ["formals", "jeans", "strictly prohibited"],
  },

  {
    name: "9. CSE Curriculum Total Credits & Marks",
    query: "What are the total credits and marks for B.E. Computer Science and Engineering?",
    expectedRefusal: false,
    expectedCitationSnippet: "B.E. Computer Science and Engineering Curriculum 2023",
    expectedKeywords: ["161", "5400"],
  },
  {
    name: "10. Negative Refusal: Baking Cake Recipe",
    query: "What is the best recipe for baking a chocolate cake?",
    expectedRefusal: true,
  },
  {
    name: "11. Negative Refusal: World Cup Champions",
    query: "Who won the 2022 FIFA football world cup?",
    expectedRefusal: true,
  },

];

console.log("🧪 Running Sathyabama University RAG Pipeline Verification Suite...\n");

let passed = 0;
let failed = 0;

for (const test of TEST_CASES) {
  console.log(`----------------------------------------------------------------`);
  console.log(`TEST: ${test.name}`);
  console.log(`QUERY: "${test.query}" [Lang: ${test.language || "en"}]`);

  const response = generateGroundedRegulationResponse(test.query, test.language || "en");

  if (test.expectedRefusal) {
    if (response.refused) {
      console.log(`✅ PASS: Correctly refused out-of-domain query (Score: ${response.topScore.toFixed(3)})`);
      console.log(`   Response: "${response.reply.slice(0, 100)}..."`);
      passed++;
    } else {
      console.error(`❌ FAIL: Expected refusal, but retrieved chunk with score ${response.topScore.toFixed(3)}`);
      console.error(`   Citations:`, response.citations);
      failed++;
    }
  } else {
    if (response.refused) {
      console.error(`❌ FAIL: Legitimate query was falsely refused! (Score: ${response.topScore.toFixed(3)})`);
      failed++;
    } else {
      const citationMatched = test.expectedCitationSnippet
        ? response.reply.includes(test.expectedCitationSnippet) ||
          response.citations.some((c) => c.source.includes(test.expectedCitationSnippet!) || c.section?.includes(test.expectedCitationSnippet!))
        : true;

      const lowerReply = response.reply.toLowerCase();
      const keywordsMatched = test.expectedKeywords
        ? test.expectedKeywords.every((kw) => lowerReply.includes(kw.toLowerCase()))
        : true;

      if (citationMatched && keywordsMatched) {
        console.log(`✅ PASS: Grounded answer retrieved with score ${response.topScore.toFixed(3)}`);
        console.log(`   Citation: ${response.citations[0]?.source} - ${response.citations[0]?.section}`);
        console.log(`   Snippet: "${response.reply.slice(0, 120).replace(/\n/g, " ")}..."`);
        passed++;
      } else {
        console.error(`❌ FAIL: Answer missing expected citation or keywords`);
        if (!citationMatched) console.error(`   Expected citation snippet: "${test.expectedCitationSnippet}"`);
        if (!keywordsMatched) console.error(`   Expected keywords:`, test.expectedKeywords);
        console.error(`   Actual reply:`, response.reply);
        failed++;
      }
    }
  }
}

console.log(`\n================================================================`);
console.log(`📊 TEST RESULTS: ${passed} PASSED, ${failed} FAILED (Total: ${TEST_CASES.length})`);
console.log(`================================================================\n`);

if (failed > 0) {
  process.exit(1);
}
