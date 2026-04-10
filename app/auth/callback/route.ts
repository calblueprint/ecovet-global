import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/auth/sign-in";
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || request.nextUrl.origin;

  console.log("CALLBACK HIT:", { code, next, baseUrl });

  if (code) {
    const supabase = await getSupabaseServerClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    console.log("CODE EXCHANGE RESULT:", { error: error?.message });

    if (!error) {
      return NextResponse.redirect(new URL(next, baseUrl));
    }
  }

  return NextResponse.redirect(new URL("/auth/sign-in", baseUrl));
}
