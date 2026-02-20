import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const { data, error } = await supabase.auth.admin.createUser({
  email: "admin@cib.gov",
  password: "admin123456",
  email_confirm: true,
});

if (error) {
  console.error("Error creating admin user:", error.message);
} else {
  console.log("Admin user created successfully:", data.user?.id);
}
