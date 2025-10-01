import { exec } from "child_process";
import path from "path";

const seedFile = path.join(__dirname, "../supabase/seeds/seed.sql");

if (!seedFile) {
  console.error("Seed file not found");
  process.exit(1);
}

// Run SQL seed via Supabase
const cmd = `npx supabase db seed --file ${seedFile}`;

exec(cmd, (error, stdout, stderr) => {
  if (error) {
    console.error(`Error seeding database: ${stderr}`);
    process.exit(1);
  }
  console.log(`Database seeded successfully:\n${stdout}`);
});
