"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function updateBusiness(
  businessId: string,
  values: { name: string; accent_color: string; logo_path: string | null },
): Promise<{ ok: true } | { ok: false; error: string }> {
  const name = values.name.trim();
  if (!name) return { ok: false, error: "Butikken må ha et navn." };
  if (!/^#[0-9a-fA-F]{6}$/.test(values.accent_color)) return { ok: false, error: "Ugyldig farge." };
  if (values.logo_path && !values.logo_path.startsWith(`${businessId}/`)) return { ok: false, error: "Ugyldig logo." };

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("businesses")
    .update({ name, accent_color: values.accent_color, logo_path: values.logo_path })
    .eq("id", businessId)
    .select("id");
  if (error || !data?.length) return { ok: false, error: "Kunne ikke lagre. Bare eieren av butikken kan endre dette." };

  revalidatePath("/admin");
  return { ok: true };
}
