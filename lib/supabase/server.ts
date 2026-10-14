import { cookies } from "next/headers";
import { createServerClient as createServerClientSB } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { Database } from "../../types/database.types";

export async function getSupabaseServerClient() {
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    throw new Error(
      "No Supabase environment variables detected, please make sure they are in place!",
    );
  }

  const cookieStore = await cookies();

  return createServerClientSB<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            try {
              cookieStore.set(name, value, options);
            } catch {
              console.log(
                `Error setting cookie ${name}:${value} with options ${options}`,
              );
            }
          });
        },
      },
    },
  );
}

// This client has full admin privileges, including bypassing RLS
// Do NOT use this client in client-side code, only in server-side code
export function getSupabaseAdminClient() {
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.SUPABASE_SERVICE_ROLE_KEY
  ) {
    throw new Error(
      "Missing Supabase URL or Service Role Key. Make sure SUPABASE_SERVICE_ROLE_KEY is set in your environment variables.",
    );
  }

  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  );
}

// listUsers is paginated (50 per page by default), so walk every page
export async function findAuthUserByEmail(email: string) {
  const adminClient = getSupabaseAdminClient();
  const lowerCaseEmail = email.toLowerCase();
  const perPage = 1000;

  for (let page = 1; ; page++) {
    const { data, error } = await adminClient.auth.admin.listUsers({
      page,
      perPage,
    });
    if (error) throw error;

    const user = data.users.find(
      u => u.email?.toLowerCase() === lowerCaseEmail,
    );
    if (user) return user;
    if (data.users.length < perPage) return null;
  }
}
