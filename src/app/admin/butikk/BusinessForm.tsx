"use client";

import { useState, useTransition } from "react";
import { createClient } from "@/lib/supabase/client";
import { IMAGE_BUCKET, imageUrl } from "@/lib/env";
import { updateBusiness } from "./actions";

type Values = { name: string; accent_color: string; logo_path: string | null };

export function BusinessForm({ businessId, initial }: { businessId: string; initial: Values }) {
  const [values, setValues] = useState(initial);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [uploading, setUploading] = useState(false);
  const [pending, startTransition] = useTransition();

  async function onLogo(file: File | undefined) {
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) return setMsg({ ok: false, text: "Logoen er for stor. Maks 5 MB." });
    setUploading(true);
    const ext = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
    const path = `${businessId}/logo/${crypto.randomUUID()}.${ext}`;
    const { error } = await createClient().storage.from(IMAGE_BUCKET).upload(path, file, { contentType: file.type });
    setUploading(false);
    if (error) return setMsg({ ok: false, text: "Logoen kunne ikke lastes opp. Bruk PNG eller JPG." });
    setValues((v) => ({ ...v, logo_path: path }));
    setMsg(null);
  }

  function save() {
    startTransition(async () => {
      const res = await updateBusiness(businessId, values);
      setMsg(res.ok ? { ok: true, text: "Lagret." } : { ok: false, text: res.error });
    });
  }

  const logo = imageUrl(values.logo_path);

  return (
    <div className="panel stack">
      <label className="field">
        Butikkens navn
        <input
          className="input"
          id="name"
          value={values.name}
          maxLength={80}
          onChange={(e) => setValues({ ...values, name: e.target.value })}
        />
      </label>

      <div className="field">
        Logo (valgfritt)
        <div className="row">
          {logo && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logo} alt="Logo" style={{ maxHeight: 44, maxWidth: 160, objectFit: "contain" }} />
          )}
          <label className="btn btn-ghost" style={{ position: "relative" }}>
            {uploading ? "Laster opp …" : logo ? "Bytt logo" : "Last opp logo"}
            <input
              type="file"
              id="logo"
              accept="image/png,image/jpeg,image/webp"
              style={{ position: "absolute", inset: 0, opacity: 0, cursor: "pointer" }}
              onChange={(e) => onLogo(e.target.files?.[0])}
            />
          </label>
          {logo && (
            <button type="button" className="linkbtn" onClick={() => setValues({ ...values, logo_path: null })}>
              Fjern logo
            </button>
          )}
        </div>
      </div>

      <label className="field">
        Fremhevingsfarge
        <div className="row">
          <input
            type="color"
            id="accent"
            value={values.accent_color}
            onChange={(e) => setValues({ ...values, accent_color: e.target.value })}
            style={{ width: 48, height: 42, border: "1px solid var(--line)", borderRadius: 8, padding: 2, background: "var(--surface-2)" }}
          />
          <span className="mono">{values.accent_color}</span>
        </div>
      </label>

      <div className="row">
        <button type="button" className="btn" onClick={save} disabled={pending || uploading}>
          {pending ? "Lagrer …" : "Lagre"}
        </button>
        {msg && <p className={`msg ${msg.ok ? "msg-ok" : "msg-error"}`} role="status">{msg.text}</p>}
      </div>
    </div>
  );
}
