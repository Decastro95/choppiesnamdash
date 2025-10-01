import { exec } from "child_process";
import fs from "fs";
import path from "path";

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const outputPath = path.join(__dirname, "../src/types/supabase.ts");

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error("Missing environment variables SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const cmd = `npx supabase gen types typescript --project-id ${SUPABASE_URL} --schema public`;

exec(cmd, (error, stdout, stderr) => {
  if (error) {
    console.error(`Error generating types: ${stderr}`);
    process.exit(1);
  }
  fs.writeFileSync(outputPath, stdout);
  console.log(`Supabase types generated at ${outputPath}`);
});

