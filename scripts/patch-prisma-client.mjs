import { readFileSync, writeFileSync, readdirSync, statSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const baseDir = join(__dirname, "..", "generated", "prisma");

function walk(dir, files = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      walk(full, files);
    } else if (entry.endsWith(".ts")) {
      files.push(full);
    }
  }
  return files;
}

const files = walk(baseDir);
let patched = 0;

for (const file of files) {
  let code = readFileSync(file, "utf8");
  let changed = false;

  // Remove globalThis.__dirname = ... line (CJS-incompatible)
  const afterMeta = code.replace(
    /globalThis\[['"]__dirname['"]\] = .*?\(import\.meta\.url\)\)\n?/,
    ""
  );
  if (afterMeta !== code) {
    code = afterMeta;
    changed = true;
  }

  // Replace ".ts" extension in import/export specifiers with ".js"
  const afterExt = code.replace(
    /(\b(?:from|export\s*\*)\s*["']\.\/.*?)\.ts(["'])/g,
    "$1.js$2"
  );
  if (afterExt !== code) {
    code = afterExt;
    changed = true;
  }

  if (changed) {
    writeFileSync(file, code, "utf8");
    patched++;
  }
}

if (patched > 0) {
  console.log(`✅ Patched ${patched} generated Prisma client file(s) (import.meta.url + .ts→.js)`);
} else {
  console.log("⚠️  No generated files needed patching");
}
