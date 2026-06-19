import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Ignore generated artifacts and duplicate nested projects (not real app source).
  globalIgnores([
    "**/.next/**",
    "**/node_modules/**",
    "**/out/**",
    "**/build/**",
    "**/dist/**",
    "**/coverage/**",
    "**/.turbo/**",
    "**/.vercel/**",
    "next-env.d.ts",
    "scripts/**",
    "_backup/**",
    // Accidental create-next-app duplicate (moved to _backup/); keep ignored if restored.
    "flash-nexus/**",
  ]),
]);

export default eslintConfig;
