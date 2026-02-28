import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  const { email, password } = await req.json();

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!, // server only
  );

  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (error) {
    return Response.json({ error: error }, { status: 400 });
  }

  if (!data?.user) {
    return Response.json({ error: "User creation failed." }, { status: 400 });
  }
  const { error: profileError } = await supabase.from("profile").upsert({
    id: data.user.id,
    user_type: "Admin",
    email: email,
    user_group_id: "0b73ed2d-61c3-472e-b361-edaa88f27622",
  });

  if (profileError) {
    return Response.json({ error: profileError }, { status: 400 });
  }

  return Response.json({ data, error });
  ``;
}
