/**
 * Phase 2B-2 apply workflow helpers — never prints secret values.
 */
const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

const ROOT = path.join(__dirname, "..");
const ENV_PATH = path.join(ROOT, ".env.local");

function readEnv() {
  if (!fs.existsSync(ENV_PATH)) return {};
  const out = {};
  for (const line of fs.readFileSync(ENV_PATH, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, "");
    out[key] = value;
  }
  return out;
}

function envReport() {
  const env = readEnv();
  const url = env.NEXT_PUBLIC_SUPABASE_URL || "";
  const anon =
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    "";
  const service = env.SUPABASE_SERVICE_ROLE_KEY || "";

  console.log("ENV_FILE=" + (fs.existsSync(ENV_PATH) ? "OK" : "MISSING"));
  console.log(
    "NEXT_PUBLIC_SUPABASE_URL=" + (url.length > 0 ? `SET(len=${url.length})` : "EMPTY"),
  );
  console.log(
    "NEXT_PUBLIC_SUPABASE_ANON_KEY=" +
      (anon.length > 0 ? `SET(len=${anon.length})` : "EMPTY"),
  );
  console.log(
    "SUPABASE_SERVICE_ROLE_KEY=" +
      (service.length > 0 ? `SET(len=${service.length})` : "EMPTY"),
  );

  if (env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY && !env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.log("NOTE=Using NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY alias (rename to ANON_KEY recommended)");
  }

  return { url, anon, service };
}

function projectRefFromUrl(url) {
  try {
    return new URL(url).hostname.split(".")[0] || "";
  } catch {
    return "";
  }
}

function isLinked() {
  const refPath = path.join(ROOT, "supabase", ".temp", "project-ref");
  return fs.existsSync(refPath) && fs.readFileSync(refPath, "utf8").trim().length > 0;
}

function run(cmd, args, opts = {}) {
  console.log(`\n> ${cmd} ${args.join(" ")}`);
  const result = spawnSync(cmd, args, {
    cwd: ROOT,
    stdio: "inherit",
    shell: process.platform === "win32",
    ...opts,
  });
  return result.status ?? 1;
}

function setEnvValue(key, value) {
  const lines = fs.existsSync(ENV_PATH)
    ? fs.readFileSync(ENV_PATH, "utf8").split(/\r?\n/)
    : [];
  let found = false;
  const updated = lines.map((line) => {
    if (line.trim().startsWith(`${key}=`)) {
      found = true;
      return `${key}=${value}`;
    }
    return line;
  });
  if (!found) updated.push(`${key}=${value}`);
  fs.writeFileSync(ENV_PATH, updated.filter((l, i, a) => !(i === a.length - 1 && l === "")).join("\n") + "\n", "utf8");
}

function runCapture(cmd, args) {
  return spawnSync(cmd, args, {
    cwd: ROOT,
    shell: process.platform === "win32",
    encoding: "utf8",
  });
}

const command = process.argv[2] || "report";

if (command === "fetch-service-role") {
  const { url, service } = envReport();
  if (service.length > 0) {
    console.log("SUPABASE_SERVICE_ROLE_KEY=ALREADY_SET");
    process.exit(0);
  }
  const ref = projectRefFromUrl(url);
  if (!ref) {
    console.error("Cannot derive project ref from NEXT_PUBLIC_SUPABASE_URL");
    process.exit(1);
  }
  console.log(`PROJECT_REF=OK(len=${ref.length})`);
  console.log("\n> npx supabase projects api-keys --project-ref <ref> -o json");
  const result = runCapture("npx", [
    "supabase",
    "projects",
    "api-keys",
    "--project-ref",
    ref,
    "-o",
    "json",
  ]);
  if (result.status !== 0) {
    console.error("Failed to fetch API keys. Run: npx supabase login");
    process.exit(result.status ?? 1);
  }
  let keys;
  try {
    keys = JSON.parse(result.stdout);
  } catch {
    console.error("Could not parse API keys JSON");
    process.exit(1);
  }
  const list = Array.isArray(keys) ? keys : keys.keys || [];
  const serviceEntry = list.find(
    (k) =>
      k.name === "service_role" ||
      k.id === "service_role" ||
      (k.type && String(k.type).includes("service")),
  );
  const serviceKey = serviceEntry?.api_key || serviceEntry?.key || "";
  if (!serviceKey) {
    console.error("service_role key not found in API response");
    process.exit(1);
  }
  setEnvValue("SUPABASE_SERVICE_ROLE_KEY", serviceKey);
  console.log("SUPABASE_SERVICE_ROLE_KEY=WRITTEN(len=" + serviceKey.length + ")");
  process.exit(0);
}

if (command === "apply-all") {
  envReport();
  if (!isLinked()) {
    const linkCode = run("node", [path.join(__dirname, "phase-2b2-apply.cjs"), "link"]);
    if (linkCode !== 0) process.exit(linkCode);
  }
  const steps = ["push", "seed", "types"];
  for (const step of steps) {
    const code = run("node", [path.join(__dirname, "phase-2b2-apply.cjs"), step]);
    if (code !== 0) process.exit(code);
  }
  console.log("\nPhase 2B-2 apply-all complete.");
  process.exit(0);
}

if (command === "report") {
  envReport();
  console.log("LINKED=" + (isLinked() ? "YES" : "NO"));
  process.exit(0);
}

if (command === "link") {
  const { url } = envReport();
  const ref = projectRefFromUrl(url);
  if (!ref) {
    console.error("Cannot derive project ref from NEXT_PUBLIC_SUPABASE_URL");
    process.exit(1);
  }
  console.log(`PROJECT_REF=OK(len=${ref.length})`);
  const code = run("npx", ["supabase", "link", "--project-ref", ref, "--yes"]);
  process.exit(code);
}

if (command === "push") {
  const sync = run("npm", ["run", "db:sync-migrations"]);
  if (sync !== 0) process.exit(sync);
  process.exit(run("npx", ["supabase", "db", "push"]));
}

if (command === "seed") {
  const seedPath = path.join(ROOT, "database", "seeds", "001_seed_roles_permissions.sql");
  if (!fs.existsSync(seedPath)) {
    console.error("Seed file missing");
    process.exit(1);
  }
  process.exit(run("npx", ["supabase", "db", "execute", "--file", seedPath]));
}

if (command === "types") {
  const typesPath = path.join(ROOT, "lib", "supabase", "types.ts");
  console.log(`\n> Generating types to lib/supabase/types.ts`);
  const result = spawnSync(
    "npx",
    ["supabase", "gen", "types", "typescript", "--linked", "--schema", "public"],
    { cwd: ROOT, shell: process.platform === "win32" },
  );
  if (result.status !== 0) process.exit(result.status ?? 1);
  fs.writeFileSync(typesPath, result.stdout, "utf8");
  console.log("Types written.");
  process.exit(0);
}

console.error("Unknown command:", command);
process.exit(1);
