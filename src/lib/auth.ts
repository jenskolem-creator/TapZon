import "server-only";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type Membership = {
  business_id: string;
  role: "owner" | "staff";
  businesses: { id: string; name: string; logo_path: string | null; accent_color: string | null };
};

/**
 * Krever innlogget bruker. Sender til innloggingssiden ellers.
 * Har brukeren fortsatt et midlertidig passord, sendes de til «Lag passord» først.
 */
export async function requireUser({ allowTempPassword = false } = {}) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) redirect("/admin/logg-inn");
  if (!allowTempPassword && data.user.user_metadata?.must_change_password) redirect("/admin/nytt-passord");
  return { supabase, user: data.user };
}

export async function isPlatformAdmin() {
  const { supabase, user } = await requireUser();
  const { data } = await supabase.from("platform_admins").select("user_id").eq("user_id", user.id).maybeSingle();
  return Boolean(data);
}

/** Krever at brukeren er plattform-admin (deg). */
export async function requireSuperadmin() {
  const ctx = await requireUser();
  if (!(await isPlatformAdmin())) redirect("/admin");
  return ctx;
}

export async function getMemberships(): Promise<Membership[]> {
  const { supabase, user } = await requireUser();
  const { data, error } = await supabase
    .from("business_members")
    .select("business_id, role, businesses(id, name, logo_path, accent_color)")
    .eq("user_id", user.id);
  if (error) throw error;
  return (data ?? []) as unknown as Membership[];
}
