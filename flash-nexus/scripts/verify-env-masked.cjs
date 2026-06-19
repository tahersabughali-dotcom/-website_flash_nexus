/**
 * Masked .env.local verification — never prints secret values.
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
  console.log("FILE=MISSING");
  process.exit(1);
}

const content = fs.readFileSync(envPath, "utf8");
const url = readValue(content, "NEXT_PUBLIC_SUPABASE_URL");
const anon =
  readValue(content, "NEXT_PUBLIC_SUPABASE_ANON_KEY") ||
  readValue(content, "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY");
const service = readValue(content, "SUPABASE_SERVICE_ROLE_KEY");
const urlOk = /^https:\/\/[a-z0-9-]+\.supabase\.co\/?$/i.test(url);

console.log("FILE=OK");
console.log("FILE_BYTES=" + fs.statSync(envPath).size);
console.log("1_URL_NOT_EMPTY=" + (url.length > 0));
console.log(
  "4_URL_FORMAT=" + (urlOk ? "https://****.supabase.co" : url.length > 0 ? "INVALID" : "EMPTY"),
);
console.log("2_ANON_NOT_EMPTY=" + (anon.length > 0));
console.log("3_SERVICE_NOT_EMPTY=" + (service.length > 0));

const ok = url.length > 0 && anon.length > 0 && service.length > 0 && urlOk;
console.log("VALID=" + ok);
process.exit(ok ? 0 : 1);
