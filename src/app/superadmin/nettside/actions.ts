"use server";

import { revalidatePath } from "next/cache";
import { requireSuperadmin } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/server";
import { normalizeContent, type SiteContent } from "@/lib/siteContentTypes";

export async function saveSiteContent(content: SiteContent): Promise<{ ok: true } | { ok: false; error: string }> {
  await requireSuperadmin();
  const data = normalizeContent(content);
  // Tomme punkter og avsnitt (f.eks. en tom linje) skal ikke vises på siden.
  data.services.offers.forEach((o) => { o.points = o.points.filter(Boolean); });
  data.ideas.paragraphs = data.ideas.paragraphs.filter(Boolean);

  const { error } = await createAdminClient()
    .from("site_content")
    .upsert({ id: "main", data, updated_at: new Date().toISOString() });
  if (error) {
    if (error.code === "42P01" || error.message.includes("site_content")) {
      return { ok: false, error: "Tabellen for nettsideinnhold mangler. Kjør filen 0002_site_content.sql i Supabase først." };
    }
    return { ok: false, error: "Kunne ikke lagre. Prøv igjen." };
  }

  revalidatePath("/");
  revalidatePath("/tjenester");
  return { ok: true };
}
