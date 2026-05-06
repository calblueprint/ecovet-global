import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { type EmailOtpType } from "@supabase/supabase-js";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const next = searchParams.get("next") ?? "/auth/sign-up";

  if (!token_hash || !type) {
    return NextResponse.redirect(new URL("/auth/auth-error", request.url));
  }

  const supabase = await getSupabaseServerClient();
  const { error } = await supabase.auth.verifyOtp({ type, token_hash });

  if (error) {
    console.error("verifyOtp error:", error.message);
    return NextResponse.redirect(
      new URL(
        `/auth/auth-error?error=${encodeURIComponent(error.message)}`,
        request.url,
      ),
    );
  }

  return NextResponse.redirect(new URL(next, request.url));
}
