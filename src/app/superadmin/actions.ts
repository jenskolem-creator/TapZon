"use server";

import { revalidatePath } from "next/cache";
import { requireSuperadmin } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/server";
import { env } from "@/lib/env";
import type { ModuleType } from "@/lib/types";

export type FormState = { error?: string; ok?: string } | undefined;

const MODULES: ModuleType[] = ["style", "start", "loyalty"];

/** Lett lesbart midlertidig passord, f.eks. "k7mq-x4tp-9wcr". Butikkeieren bytter det ved første innlogging. */
function tempPassword() {
  const alphabet = "abcdefghjkmnpqrstuvwxyz23456789";
  const bytes = crypto.getRandomValues(new Uint8Array(12));
  const chars = Array.from(bytes, (b) => alphabet[b % alphabet.length]).join("");
  return `${chars.slice(0, 4)}-${chars.slice(4, 8)}-${chars.slice(8, 12)}`;
}

async function findUserByEmail(email: string) {
  const admin = createAdminClient();
  for (let page = 1; page <= 20; page++) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 1000 });
    if (error) throw error;
    const hit = data.users.find((u) => u.email?.toLowerCase() === email.toLowerCase());
    if (hit) return hit;
    if (data.users.length < 1000) return null;
  }
  return null;
}

/**
 * Finner brukeren med denne e-posten, eller lager en ny med midlertidig passord.
 * Ingen e-post sendes: du gir passordet til butikkeieren selv.
 */
async function findOrCreateUser(email: string): Promise<{ id: string; password: string | null }> {
  const existing = await findUserByEmail(email);
  if (existing) return { id: existing.id, password: null };

  const password = tempPassword();
  const { data, error } = await createAdminClient().auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { must_change_password: true },
  });
  if (error || !data.user) throw new Error(error?.message ?? "Kunne ikke lage brukeren");
  return { id: data.user.id, password };
}

function loginMessage(email: string, password: string | null) {
  return password
    ? `Konto laget for ${email}. Midlertidig passord: ${password} (vises bare nå, noter det). Innlogging: ${env.siteUrl}/admin`
    : `${email} hadde allerede konto og har nå tilgang.`;
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
    const user = await findOrCreateUser(email);
    await admin.from("business_members").insert({ business_id: business.id, user_id: user.id, role: "owner" });
    if (count > 0) await createCards(business.id, count, "style");
    revalidatePath("/superadmin");
    return { ok: `${name} er opprettet med ${count} brikker. ${loginMessage(email, user.password)}` };
  } catch (e) {
    return { error: `Butikken ble opprettet, men noe feilet: ${(e as Error).message}` };
  }
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
    const user = await findOrCreateUser(email);
    const { error } = await createAdminClient()
      .from("business_members")
      .upsert({ business_id: businessId, user_id: user.id, role });
    if (error) throw error;
    revalidatePath(`/superadmin/butikk/${businessId}`);
    return { ok: loginMessage(email, user.password) };
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

/** Gir en person et nytt midlertidig passord, for eksempel hvis de har glemt sitt. */
export async function resetMemberPassword(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireSuperadmin();
  const userId = String(formData.get("user_id"));
  const password = tempPassword();
  const { data, error } = await createAdminClient().auth.admin.updateUserById(userId, {
    password,
    user_metadata: { must_change_password: true },
  });
  if (error) return { error: "Kunne ikke lage nytt passord." };
  return { ok: `Nytt midlertidig passord for ${data.user.email}: ${password}` };
}
