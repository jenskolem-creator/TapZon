"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { IMAGE_BUCKET } from "@/lib/env";
import { MAX_COLORS, MAX_LOOKS, type StyleLook } from "@/lib/types";

export type SaveResult = { ok: true } | { ok: false; error: string };

const HEX = /^#[0-9a-fA-F]{6}$/;

export async function saveStyleCard(input: {
  cardId: string;
  label: string;
  title: string;
  looks: StyleLook[];
}): Promise<SaveResult> {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return { ok: false, error: "Du er logget ut. Logg inn på nytt og prøv igjen." };

  if (!input.title.trim()) return { ok: false, error: "Gi plagget et navn før du lagrer." };
  if (input.looks.length < 1 || input.looks.length > MAX_LOOKS) {
    return { ok: false, error: "Et plagg må ha ett eller to stylingforslag." };
  }
  for (const look of input.looks) {
    if (look.colors.length > MAX_COLORS) return { ok: false, error: `Maks ${MAX_COLORS} farger per forslag.` };
    if (look.colors.some((c) => !HEX.test(c.hex))) return { ok: false, error: "En av fargene er ugyldig." };
  }

  const { data: card } = await supabase.from("cards").select("id, business_id").eq("id", input.cardId).maybeSingle();
  if (!card) return { ok: false, error: "Fant ikke brikken, eller du har ikke tilgang til den." };

  const { error } = await supabase.rpc("save_style_card", {
    p_card_id: input.cardId,
    p_title: input.title.trim(),
    p_looks: input.looks.map((l) => ({
      image_path: l.image_path,
      caption: l.caption.trim(),
      colors: l.colors.map((c) => ({ hex: c.hex, label: c.label.trim() })),
    })),
  });
  if (error) return { ok: false, error: "Kunne ikke lagre. Sjekk nettet og prøv igjen." };

  await supabase.from("cards").update({ label: input.label.trim() }).eq("id", input.cardId);

  // Rydd bort bilder i brikkens mappe som ikke lenger brukes (byttet ut eller fjernet).
  const folder = `${card.business_id}/${card.id}`;
  const { data: files } = await supabase.storage.from(IMAGE_BUCKET).list(folder, { limit: 100 });
  const inUse = new Set(input.looks.map((l) => l.image_path).filter(Boolean));
  const unused = (files ?? []).map((f) => `${folder}/${f.name}`).filter((p) => !inUse.has(p));
  if (unused.length) await supabase.storage.from(IMAGE_BUCKET).remove(unused);

  revalidatePath(`/k/${input.cardId}`);
  revalidatePath("/admin");
  return { ok: true };
}
