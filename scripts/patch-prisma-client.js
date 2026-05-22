import { readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const clientPath = join(__dirname, "..", "generated", "prisma", "client.ts");

try {
  let code = readFileSync(clientPath, "utf8");
  const original = code;
  code = code.replace(
    /globalThis\['__dirname'\] = path\.dirname\(fileURLToPath\(import\.meta\.url\)\);/,
    ""
  );
  if (code !== original) {
    writeFileSync(clientPath, code, "utf8");
    console.log("✅ Patched import.meta.url in generated Prisma client");
  } else {
    console.log("⚠️  Pattern not found in client.ts, may already be patched");
  }
} catch (e) {
  console.error("Failed to patch Prisma client:", e);
  process.exit(1);
}
