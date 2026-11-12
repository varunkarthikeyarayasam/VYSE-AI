// ============================================================================
// SATHYABAMA UNIVERSITY DOCUMENT INGESTION PIPELINE & VALIDATOR
// Run via: npx tsx scripts/ingest-regulations.ts
// ============================================================================

import { SATHYABAMA_OFFICIAL_DOCUMENTS, type DocumentChunk } from "../src/lib/rag/sathyabamaDocuments";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export interface IngestionReport {
  totalChunks: number;
  categories: Record<string, number>;
  documents: Record<string, number>;
  missingFields: string[];
  sqlMigrationPath: string;
}

export function validateDocumentChunks(chunks: DocumentChunk[]): string[] {
  const errors: string[] = [];
  const ids = new Set<string>();

  chunks.forEach((c, idx) => {
    if (!c.id) errors.push(`Chunk [${idx}] missing id`);
    if (ids.has(c.id)) errors.push(`Duplicate chunk id: "${c.id}"`);
    ids.add(c.id);

    if (!c.document) errors.push(`Chunk "${c.id}" missing document title`);
    if (!c.section) errors.push(`Chunk "${c.id}" missing section/clause`);
    if (!c.title) errors.push(`Chunk "${c.id}" missing title`);
    if (!c.category) errors.push(`Chunk "${c.id}" missing category`);
    if (!c.content || c.content.trim().length < 20) {
      errors.push(`Chunk "${c.id}" has empty or insufficient content (<20 chars)`);
    }
    if (!c.citation || !c.citation.startsWith("[")) {
      errors.push(`Chunk "${c.id}" invalid citation format (must be bracketed e.g. [Document, Section])`);
    }
    if (!Array.isArray(c.keywords) || c.keywords.length === 0) {
      errors.push(`Chunk "${c.id}" keywords must be a non-empty array`);
    }
  });

  return errors;
}

export function generateSqlSeedMigration(chunks: DocumentChunk[]): string {
  const lines: string[] = [
    "-- ============================================================================",
    "-- 012_sathyabama_official_documents.sql",
    "-- Verified Sathyabama Institutional Regulations, Handbook & Curriculum Corpus",
    "-- ============================================================================",
    "",
    "-- 1. Clear previous mock entries to maintain absolute data integrity",
    "DELETE FROM knowledge_documents WHERE verified = true;",
    "",
    "-- 2. Insert verified official regulatory chunks",
    "INSERT INTO knowledge_documents (title, content, category, source, verified) VALUES",
  ];

  const escapeSql = (str: string) => str.replace(/'/g, "''");

  const valueTuples = chunks.map((c) => {
    const title = escapeSql(c.title);
    const content = escapeSql(`${c.content}\n\n[Citation: ${c.citation}]`);
    const category = escapeSql(c.category);
    const source = escapeSql(`${c.document} - ${c.section}`);
    return `  ('${title}', '${content}', '${category}', '${source}', true)`;
  });

  lines.push(valueTuples.join(",\n") + ";");
  lines.push("");
  lines.push("-- Verify row count");
  lines.push("SELECT count(*) as total_official_rules FROM knowledge_documents WHERE verified = true;");

  return lines.join("\n");
}

export function runIngestion(): IngestionReport {
  console.log("🚀 Starting Sathyabama University Document Ingestion Pipeline...");

  const errors = validateDocumentChunks(SATHYABAMA_OFFICIAL_DOCUMENTS);
  if (errors.length > 0) {
    console.error("❌ Validation failed with errors:", errors);
    throw new Error(`Ingestion halted: ${errors.length} validation issues found.`);
  }

  const categories: Record<string, number> = {};
  const documents: Record<string, number> = {};

  for (const c of SATHYABAMA_OFFICIAL_DOCUMENTS) {
    categories[c.category] = (categories[c.category] || 0) + 1;
    documents[c.document] = (documents[c.document] || 0) + 1;
  }

  const sqlContent = generateSqlSeedMigration(SATHYABAMA_OFFICIAL_DOCUMENTS);
  const outPath = path.resolve(__dirname, "../supabase/migrations/012_sathyabama_official_documents.sql");

  fs.writeFileSync(outPath, sqlContent, "utf-8");
  console.log(`✅ Generated SQL Seed: ${outPath} (${SATHYABAMA_OFFICIAL_DOCUMENTS.length} chunks)`);

  return {
    totalChunks: SATHYABAMA_OFFICIAL_DOCUMENTS.length,
    categories,
    documents,
    missingFields: errors,
    sqlMigrationPath: outPath,
  };
}

const report = runIngestion();
console.log("\n📊 INGESTION SUMMARY REPORT:");
console.log(`Total Chunks: ${report.totalChunks}`);
console.log("Documents Covered:", JSON.stringify(report.documents, null, 2));
console.log("Categories:", JSON.stringify(report.categories, null, 2));
console.log("Migration File Generated:", report.sqlMigrationPath);

