import "server-only";
import { createClient } from "@supabase/supabase-js";
import { env } from "@/lib/env";

/** Anonym klient uten innlogging, for den offentlige kortsiden. Har kun tilgang til get_public_card(). */
export function createPublicClient() {
  return createClient(env.supabaseUrl, env.supabaseKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
