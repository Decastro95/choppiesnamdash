import fs from "fs";
import path from "path";
import glob from "glob";

const baseDir = process.argv[2] || "src/pages/Dashboard";

const files = glob.sync(`${baseDir}/**/*.tsx`);

files.forEach((file) => {
  const content = fs.readFileSync(file, "utf-8");
  const importRegex = /from\s+["']([^"']+)["']/g;
  let match;
  while ((match = importRegex.exec(content)) !== null) {
    const importPath = match[1];
    if (importPath.startsWith(".")) {
      const resolved = path.resolve(path.dirname(file), importPath);
      const candidates = [
        resolved,
        resolved + ".ts",
        resolved + ".tsx",
        resolved + "/index.ts",
        resolved + "/index.tsx",
      ];

      const exists = candidates.some((c) => fs.existsSync(c));
      if (!exists) {
        console.log(`❌ Missing import in ${file}: ${importPath}`);
        const targetFile = resolved + ".tsx";
        fs.mkdirSync(path.dirname(targetFile), { recursive: true });
        fs.writeFileSync(
          targetFile,
          `// Auto-generated placeholder for missing import: ${importPath}\nexport default function Placeholder() { return <div>Placeholder for ${importPath}</div>; }\n`
        );
        console.log(`✅ Created placeholder at ${targetFile}`);
      }
    }
  }
});

console.log("✅ Import check + autofix finished");
