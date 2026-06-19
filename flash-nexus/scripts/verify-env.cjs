/**
 * Verify .env.local keys exist without printing secret values.
 * Usage: node scripts/verify-env.cjs
 */
const fs = require("fs");
const path = require("path");

const envPath = path.join(__dirname, "..", ".env.local");

function readValue(content, key) {
  const match = content.match(new RegExp(`^${key}=(.*)$`, "m"));
  if (!match) return "";
  return match[1].trim().replace(/^["']|["']$/g, "");
}

if (!fs.existsSync(envPath)) {
  console.log("ENV_FILE=MISSING");
  process.exit(1);
}

console.log("ENV_FILE=OK");
const content = fs.readFileSync(envPath, "utf8");

const url = readValue(content, "NEXT_PUBLIC_SUPABASE_URL");
const anon = readValue(content, "NEXT_PUBLIC_SUPABASE_ANON_KEY");
const publishable = readValue(content, "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY");
const service = readValue(content, "SUPABASE_SERVICE_ROLE_KEY");
const publicKey = anon || publishable;

console.log(
  "NEXT_PUBLIC_SUPABASE_URL=" + (url.length > 0 ? `SET(len=${url.length})` : "EMPTY"),
);
console.log(
  "NEXT_PUBLIC_SUPABASE_ANON_KEY=" +
    (publicKey.length > 0
      ? publishable && !anon
        ? "ALIAS_OK(publishable_key_present)"
        : `SET(len=${anon.length})`
      : "EMPTY"),
);
console.log(
  "SUPABASE_SERVICE_ROLE_KEY=" +
    (service.length > 0 ? `SET(len=${service.length})` : "EMPTY"),
);

const ok = url.length > 0 && publicKey.length > 0 && service.length > 0;
process.exit(ok ? 0 : 1);
