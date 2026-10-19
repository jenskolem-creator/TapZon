import { createBrowserClient } from "@supabase/ssr";

/** Klient i nettleseren, brukes til å laste opp bilder direkte til Supabase Storage. */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
  );
}
