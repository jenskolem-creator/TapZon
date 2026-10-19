import { type NextRequest, NextResponse } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";

/**
 * Lenkene i invitasjons- og «glemt passord»-e-postene peker hit.
 * Vi bekrefter lenken, logger brukeren inn og sender videre til «Lag passord».
 */
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const nextParam = searchParams.get("next") ?? "/admin/nytt-passord";
  const next = nextParam.startsWith("/admin") ? nextParam : "/admin/nytt-passord";

  const code = searchParams.get("code");

  const supabase = await createClient();
  if (tokenHash && type) {
    const { error } = await supabase.auth.verifyOtp({ type, token_hash: tokenHash });
    if (!error) return NextResponse.redirect(new URL(next, request.url));
  } else if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(new URL(next, request.url));
  }

  const failed = new URL("/admin/logg-inn", request.url);
  failed.searchParams.set("feil", "lenke");
  return NextResponse.redirect(failed);
}
