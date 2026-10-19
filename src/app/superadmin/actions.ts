"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireSuperadmin } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/server";
import { env } from "@/lib/env";
import type { ModuleType } from "@/lib/types";

export type FormState = { error?: string; ok?: string } | undefined;

const MODULES: ModuleType[] = ["style", "start", "loyalty"];

/** Finner brukeren med denne e-posten, eller inviterer en ny (de får en e-post for å lage passord). */
async function findOrInviteUser(email: string): Promise<{ id: string; invited: boolean }> {
  const admin = createAdminClient();
  const { data, error } = await admin.auth.admin.inviteUserByEmail(email, {
    redirectTo: `${env.siteUrl}/auth/confirm?next=/admin/nytt-passord`,
  });
  if (!error && data.user) return { id: data.user.id, invited: true };

  // Finnes allerede: slå opp brukeren.
  for (let page = 1; page <= 20; page++) {
    const { data: list, error: listError } = await admin.auth.admin.listUsers({ page, perPage: 1000 });
    if (listError) break;
    const hit = list.users.find((u) => u.email?.toLowerCase() === email.toLowerCase());
    if (hit) return { id: hit.id, invited: false };
    if (list.users.length < 1000) break;
  }
  throw new Error(error?.message ?? "Kunne ikke invitere brukeren");
}

async function createCards(businessId: string, count: number, moduleType: ModuleType) {
  const rows = Array.from({ length: count }, () => ({ business_id: businessId, module_type: moduleType }));
  const { error } = await createAdminClient().from("cards").insert(rows);
  if (error) throw error;
}

function parseCount(v: FormDataEntryValue | null) {
  const n = Number(v);
  return Number.isInteger(n) && n >= 0 && n <= 200 ? n : null;
}

export async function createBusiness(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireSuperadmin();
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const count = parseCount(formData.get("count"));
  if (!name) return { error: "Skriv inn navnet på butikken." };
  if (!/^\S+@\S+\.\S+$/.test(email)) return { error: "Skriv inn en gyldig e-post til eieren." };
  if (count === null) return { error: "Antall brikker må være mellom 0 og 200." };

  const admin = createAdminClient();
  const { data: business, error } = await admin.from("businesses").insert({ name }).select("id").single();
  if (error) return { error: "Kunne ikke opprette butikken." };

  try {
    const user = await findOrInviteUser(email);
    await admin.from("business_members").insert({ business_id: business.id, user_id: user.id, role: "owner" });
    if (count > 0) await createCards(business.id, count, "style");
  } catch (e) {
    return { error: `Butikken ble opprettet, men noe feilet: ${(e as Error).message}` };
  }

  revalidatePath("/superadmin");
  redirect(`/superadmin/butikk/${business.id}`);
}

export async function addCards(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireSuperadmin();
  const businessId = String(formData.get("business_id"));
  const count = parseCount(formData.get("count"));
  const moduleType = String(formData.get("module_type")) as ModuleType;
  if (!count) return { error: "Velg hvor mange brikker (1–200)." };
  if (!MODULES.includes(moduleType)) return { error: "Ugyldig type." };
  try {
    await createCards(businessId, count, moduleType);
  } catch {
    return { error: "Kunne ikke lage brikkene." };
  }
  revalidatePath(`/superadmin/butikk/${businessId}`);
  return { ok: `${count} nye brikker er laget.` };
}

export async function addMember(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireSuperadmin();
  const businessId = String(formData.get("business_id"));
  const email = String(formData.get("email") ?? "").trim();
  const role = formData.get("role") === "staff" ? "staff" : "owner";
  if (!/^\S+@\S+\.\S+$/.test(email)) return { error: "Skriv inn en gyldig e-post." };
  try {
    const user = await findOrInviteUser(email);
    const { error } = await createAdminClient()
      .from("business_members")
      .upsert({ business_id: businessId, user_id: user.id, role });
    if (error) throw error;
    revalidatePath(`/superadmin/butikk/${businessId}`);
    return { ok: user.invited ? `Invitasjon sendt til ${email}.` : `${email} har nå tilgang.` };
  } catch (e) {
    return { error: (e as Error).message };
  }
}

export async function removeMember(formData: FormData) {
  await requireSuperadmin();
  const businessId = String(formData.get("business_id"));
  await createAdminClient()
    .from("business_members")
    .delete()
    .eq("business_id", businessId)
    .eq("user_id", String(formData.get("user_id")));
  revalidatePath(`/superadmin/butikk/${businessId}`);
}

export async function setCardActive(formData: FormData) {
  await requireSuperadmin();
  const businessId = String(formData.get("business_id"));
  await createAdminClient()
    .from("cards")
    .update({ is_active: formData.get("active") === "true" })
    .eq("id", String(formData.get("card_id")))
    .eq("business_id", businessId);
  revalidatePath(`/superadmin/butikk/${businessId}`);
}
