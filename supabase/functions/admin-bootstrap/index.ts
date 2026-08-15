import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const adminEmail = "admin@codetech.com";
    const adminPassword = "CODETECH@123";

    // Check if admin user already exists
    const { data: existingUsers } = await supabase.auth.admin.listUsers();
    const existing = existingUsers?.users?.find((u) => u.email === adminEmail);

    let userId: string;

    if (existing) {
      userId = existing.id;
      // Update password in case it changed
      await supabase.auth.admin.updateUserById(userId, {
        password: adminPassword,
        email_confirm: true,
        user_metadata: { name: "Administrator", role: "admin" },
      });
    } else {
      const { data: newUser, error } = await supabase.auth.admin.createUser({
        email: adminEmail,
        password: adminPassword,
        email_confirm: true,
        user_metadata: { name: "Administrator", role: "admin" },
      });
      if (error) throw error;
      userId = newUser.user.id;
    }

    // Set app metadata role so RLS/auth checks can use it
    await supabase.auth.admin.updateUserById(userId, {
      app_metadata: { role: "admin" },
    });

    // Upsert admins row
    await supabase.from("admins").upsert(
      {
        user_id: userId,
        email: adminEmail,
        name: "Administrator",
        role: "admin",
        last_login_at: new Date().toISOString(),
      },
      { onConflict: "email" }
    );

    return new Response(
      JSON.stringify({ success: true, adminEmail, userId }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
