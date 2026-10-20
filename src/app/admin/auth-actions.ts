"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { env } from "@/lib/env";

export type FormState = { error?: string; ok?: string } | undefined;

function safeNext(value: FormDataEntryValue | null) {
  const next = typeof value === "string" ? value : "";
  return next.startsWith("/admin") || next.startsWith("/superadmin") ? next : "/admin";
}

export async function signIn(_prev: FormState, formData: FormData): Promise<FormState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  if (!email || !password) return { error: "Skriv inn e-post og passord." };

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: "Feil e-post eller passord. Prøv igjen, eller trykk «Glemt passord?»." };

  redirect(safeNext(formData.get("neste")));
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/logg-inn");
}

export async function requestPasswordReset(_prev: FormState, formData: FormData): Promise<FormState> {
  const email = String(formData.get("email") ?? "").trim();
  if (!email) return { error: "Skriv inn e-postadressen din." };

  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${env.siteUrl}/auth/confirm?next=/admin/nytt-passord`,
  });
  if (error && error.status === 429) return { error: "For mange forsøk. Vent litt og prøv igjen." };
  // Samme svar uansett om adressen finnes, så ingen kan sjekke hvem som har konto.
  return { ok: "Hvis adressen har en konto, har vi sendt deg en lenke for å lage nytt passord." };
}

export async function setNewPassword(_prev: FormState, formData: FormData): Promise<FormState> {
  const password = String(formData.get("password") ?? "");
  const repeat = String(formData.get("repeat") ?? "");
  if (password.length < 8) return { error: "Passordet må ha minst 8 tegn." };
  if (password !== repeat) return { error: "Passordene er ikke like." };

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password, data: { must_change_password: false } });
  if (error) {
    if (error.code === "same_password") return { error: "Velg et annet passord enn det gamle." };
    return { error: "Kunne ikke lagre passordet. Åpne lenken i e-posten på nytt." };
  }
  redirect("/admin");
}
