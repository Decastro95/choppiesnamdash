import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.VITE_SUPABASE_SERVICE_ROLE_KEY! // ⚠️ service role key, not anon
);

const users = [
  { email: "admin@choppies.com", password: "Admin123!", role: "Admin" },
  { email: "manager@choppies.com", password: "Manager123!", role: "Manager" },
  { email: "cashier@choppies.com", password: "Cashier123!", role: "Cashier" },
  { email: "supplier@choppies.com", password: "Supplier123!", role: "Supplier" },
];

async function createUsers() {
  for (const user of users) {
    const { data, error } = await supabase.auth.admin.createUser({
      email: user.email,
      password: user.password,
      email_confirm: true,
      user_metadata: { role: user.role },
    });

    if (error) {
      console.error(`❌ Failed to create ${user.email}:`, error.message);
    } else {
      console.log(`✅ Created ${user.email} (${user.role})`);
    }
  }
}

createUsers();
