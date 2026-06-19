/**
 * Sync SQL from database/migrations (source of truth) to supabase/migrations (CLI apply).
 * Run: npm run db:sync-migrations
 *
 * database/migrations remains the canonical documentation path.
 * supabase/migrations is the CLI-compatible copy for `supabase db push`.
 */

const fs = require("fs");
const path = require("path");

const SOURCE_DIR = path.join(__dirname, "..", "database", "migrations");
const TARGET_DIR = path.join(__dirname, "..", "supabase", "migrations");
const BASE_TIMESTAMP = "2026061812";

const files = fs
  .readdirSync(SOURCE_DIR)
  .filter((f) => f.endsWith(".sql"))
  .sort();

if (files.length === 0) {
  console.error("No migration files found in database/migrations");
  process.exit(1);
}

fs.mkdirSync(TARGET_DIR, { recursive: true });

// Clear previous synced copies (only files matching our sync prefix pattern)
for (const existing of fs.readdirSync(TARGET_DIR)) {
  if (existing.endsWith(".sql") && existing.startsWith(BASE_TIMESTAMP)) {
    fs.unlinkSync(path.join(TARGET_DIR, existing));
  }
}

files.forEach((file, index) => {
  const seq = String(index + 1).padStart(4, "0");
  const baseName = file.replace(/^\d+_/, "");
  const targetName = `${BASE_TIMESTAMP}${seq}_${baseName}`;
  const sourcePath = path.join(SOURCE_DIR, file);
  const targetPath = path.join(TARGET_DIR, targetName);

  const header = `-- Synced from database/migrations/${file}\n-- Source of truth: database/migrations (do not edit supabase/migrations directly)\n\n`;
  const content = fs.readFileSync(sourcePath, "utf8");
  fs.writeFileSync(targetPath, header + content, "utf8");
  console.log(`Synced ${file} -> supabase/migrations/${targetName}`);
});

console.log(`\nDone. ${files.length} migration(s) synced.`);
