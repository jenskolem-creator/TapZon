import "server-only";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { createClient as createPlainClient } from "@supabase/supabase-js";
import { env } from "@/lib/env";

/** Klient for innloggede brukere (butikkeiere). Følger RLS-reglene i databasen. */
export async function createClient() {
  const cookieStore = await cookies();
  return createServerClient(env.supabaseUrl, env.supabaseKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          // Kalt fra en Server Component: proxy.ts oppdaterer sesjonen i stedet.
        }
      },
    },
  });
}

/**
 * Klient med secret-nøkkelen. Omgår RLS, så den brukes KUN i /superadmin
 * etter at requireSuperadmin() har sjekket at du er plattform-admin.
 */
export function createAdminClient() {
  if (!env.supabaseSecretKey) {
    throw new Error("SUPABASE_SECRET_KEY mangler i miljøvariablene");
  }
  return createPlainClient(env.supabaseUrl, env.supabaseSecretKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
