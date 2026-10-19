"use client";

import { useEffect, useState, useTransition } from "react";
import { createClient } from "@/lib/supabase/client";
import { IMAGE_BUCKET, imageUrl } from "@/lib/env";
import { MAX_COLORS, MAX_LOOKS, type StyleLook } from "@/lib/types";
import { StyleCardView } from "@/components/StyleCardView";
import { resizeImage } from "@/lib/resizeImage";
import { saveStyleCard } from "./actions";
import styles from "./editor.module.css";

type Draft = { label: string; title: string; looks: StyleLook[] };
type Status = { kind: "idle" | "dirty" | "saving" | "saved" | "error"; text?: string };

export function StyleEditor(props: {
  cardId: string;
  businessId: string;
  publicUrl: string;
  store: { name: string; logoUrl: string | null; accentColor: string | null };
  initial: Draft;
}) {
  const [draft, setDraft] = useState<Draft>(props.initial);
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [uploading, setUploading] = useState<number | null>(null);
  const [view, setView] = useState<"edit" | "preview">("edit");
  const [copied, setCopied] = useState(false);
  const [, startTransition] = useTransition();

  const dirty = status.kind === "dirty" || status.kind === "error";

  // Advar før man forlater siden med endringer som ikke er lagret.
  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  function update(fn: (d: Draft) => Draft) {
    setDraft((d) => fn(structuredClone(d)));
    setStatus({ kind: "dirty" });
  }

  async function onPickImage(i: number, file: File | undefined) {
    if (!file) return;
    setUploading(i);
    try {
      const blob = await resizeImage(file, 1600);
      const path = `${props.businessId}/${props.cardId}/${crypto.randomUUID()}.jpg`;
      const { error } = await createClient()
        .storage.from(IMAGE_BUCKET)
        .upload(path, blob, { contentType: "image/jpeg", cacheControl: "31536000" });
      if (error) throw error;
      update((d) => {
        d.looks[i].image_path = path;
        return d;
      });
    } catch {
      setStatus({ kind: "error", text: "Bildet kunne ikke lastes opp. Prøv et annet bilde (JPG eller PNG)." });
    } finally {
      setUploading(null);
    }
  }

  function save() {
    setStatus({ kind: "saving" });
    startTransition(async () => {
      const result = await saveStyleCard({ cardId: props.cardId, ...draft });
      setStatus(result.ok ? { kind: "saved" } : { kind: "error", text: result.error });
    });
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(props.publicUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* Kopiering ikke tillatt: adressen står synlig og kan markeres manuelt. */
    }
  }

  const preview = (
    <StyleCardView
      storeName={props.store.name}
      logoUrl={props.store.logoUrl}
      accentColor={props.store.accentColor}
      title={draft.title}
      looks={draft.looks.map((l) => ({ imageUrl: imageUrl(l.image_path), caption: l.caption, colors: l.colors }))}
    />
  );

  return (
    <div className={styles.layout} data-view={view}>
      <div className={styles.switch} role="group" aria-label="Velg visning">
        <button type="button" aria-pressed={view === "edit"} onClick={() => setView("edit")}>Rediger</button>
        <button type="button" aria-pressed={view === "preview"} onClick={() => setView("preview")}>Forhåndsvis</button>
      </div>

      <section className={styles.editor}>
        <div className={styles.head}>
          <h1>{draft.title || "Uten navn"}</h1>
          <div className="row" style={{ gap: 10 }}>
            <span className="mono" style={{ color: "var(--ink-soft)", userSelect: "all" }}>{props.publicUrl}</span>
            <button type="button" className="linkbtn" onClick={copyLink}>{copied ? "Kopiert" : "Kopier"}</button>
          </div>
        </div>

        <div className={styles.grid2}>
          <label className="field">
            Navn på plagget (kunden ser dette)
            <input
              className="input"
              id="title"
              value={draft.title}
              maxLength={120}
              placeholder="F.eks. Ullblazer i kamel"
              onChange={(e) => update((d) => ({ ...d, title: e.target.value }))}
            />
          </label>
          <label className="field">
            Hvor henger brikken? (bare for deg)
            <input
              className="input"
              id="label"
              value={draft.label}
              maxLength={80}
              placeholder="F.eks. Ved blazer-stativet"
              onChange={(e) => update((d) => ({ ...d, label: e.target.value }))}
            />
          </label>
        </div>

        <div className={styles.looks}>
          {draft.looks.map((look, i) => (
            <div key={i} className={styles.look}>
              <div className={styles.lookHead}>
                <b>Forslag {i + 1}</b>
                {draft.looks.length > 1 && (
                  <button
                    type="button"
                    className="linkbtn"
                    onClick={() => update((d) => ({ ...d, looks: d.looks.filter((_, x) => x !== i) }))}
                  >
                    Fjern forslaget
                  </button>
                )}
              </div>

              <div className={styles.imageRow}>
                <div className={styles.thumb}>
                  {look.image_path ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={imageUrl(look.image_path)!} alt="" />
                  ) : (
                    <span>Ingen bilde</span>
                  )}
                </div>
                <div className="stack" style={{ gap: 8 }}>
                  <label className={styles.upload}>
                    {uploading === i ? "Laster opp …" : look.image_path ? "Bytt bilde" : "Last opp bilde"}
                    <input
                      type="file"
                      accept="image/*"
                      id={`image-${i}`}
                      disabled={uploading !== null}
                      onChange={(e) => {
                        onPickImage(i, e.target.files?.[0]);
                        e.target.value = "";
                      }}
                    />
                  </label>
                  {look.image_path && (
                    <button
                      type="button"
                      className="linkbtn"
                      onClick={() =>
                        update((d) => {
                          d.looks[i].image_path = null;
                          return d;
                        })
                      }
                    >
                      Fjern bildet
                    </button>
                  )}
                  <span className={styles.small}>Stående bilder ser best ut.</span>
                </div>
              </div>

              <label className="field">
                Stiltekst
                <textarea
                  className="input"
                  id={`caption-${i}`}
                  rows={3}
                  maxLength={600}
                  value={look.caption}
                  placeholder="F.eks. Til kontoret: over en hvit skjorte med mørke bukser."
                  onChange={(e) =>
                    update((d) => {
                      d.looks[i].caption = e.target.value;
                      return d;
                    })
                  }
                />
              </label>

              <div className="field">
                Passer godt med
                {look.colors.map((c, ci) => (
                  <div key={ci} className={styles.colorRow}>
                    <input
                      type="color"
                      aria-label="Farge"
                      id={`color-${i}-${ci}`}
                      value={c.hex}
                      onChange={(e) =>
                        update((d) => {
                          d.looks[i].colors[ci].hex = e.target.value;
                          return d;
                        })
                      }
                    />
                    <input
                      className="input"
                      id={`color-label-${i}-${ci}`}
                      value={c.label}
                      maxLength={40}
                      placeholder="Fargenavn, f.eks. Sort"
                      onChange={(e) =>
                        update((d) => {
                          d.looks[i].colors[ci].label = e.target.value;
                          return d;
                        })
                      }
                    />
                    <button
                      type="button"
                      className={styles.remove}
                      aria-label="Fjern farge"
                      onClick={() =>
                        update((d) => {
                          d.looks[i].colors.splice(ci, 1);
                          return d;
                        })
                      }
                    >
                      &times;
                    </button>
                  </div>
                ))}
                {look.colors.length < MAX_COLORS && (
                  <button
                    type="button"
                    className={styles.add}
                    onClick={() =>
                      update((d) => {
                        d.looks[i].colors.push({ hex: "#888888", label: "" });
                        return d;
                      })
                    }
                  >
                    + Legg til farge
                  </button>
                )}
              </div>
            </div>
          ))}

          {draft.looks.length < MAX_LOOKS && (
            <button
              type="button"
              className={styles.addLook}
              onClick={() =>
                update((d) => ({ ...d, looks: [...d.looks, { image_path: null, caption: "", colors: [] }] }))
              }
            >
              + Legg til forslag {draft.looks.length + 1}
            </button>
          )}
        </div>

        <div className={styles.saveBar}>
          <button type="button" className="btn" onClick={save} disabled={!dirty || uploading !== null}>
            {status.kind === "saving" ? "Lagrer …" : "Lagre endringer"}
          </button>
          <span
            role="status"
            className={
              status.kind === "error" ? "msg msg-error" : status.kind === "saved" ? "msg msg-ok" : "msg"
            }
            style={status.kind === "dirty" ? { color: "var(--accent)" } : undefined}
          >
            {status.kind === "dirty" && "Du har endringer som ikke er lagret"}
            {status.kind === "saved" && "Lagret. Kortet viser det nye innholdet nå."}
            {status.kind === "error" && status.text}
          </span>
        </div>
      </section>

      <aside className={styles.previewPane} aria-label="Forhåndsvisning">
        <div className={styles.phone}>
          <div className={styles.screen}>{preview}</div>
        </div>
        <p className={styles.small} style={{ textAlign: "center" }}>Slik ser kunden siden etter et tapp.</p>
      </aside>
    </div>
  );
}
