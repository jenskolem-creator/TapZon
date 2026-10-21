"use client";

import { useEffect, useState, useTransition } from "react";
import type { Offer, PriceItem, SiteContent, TitleText } from "@/lib/siteContentTypes";
import { saveSiteContent } from "./actions";
import styles from "./editor.module.css";

type Status = { kind: "idle" | "dirty" | "saving" | "saved" | "error"; text?: string };

export function SiteEditor({ initial }: { initial: SiteContent }) {
  const [c, setC] = useState(initial);
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [, startTransition] = useTransition();
  const dirty = status.kind === "dirty" || status.kind === "error";

  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  /** Endre innholdet: får en kopi som kan endres direkte. */
  function edit(fn: (d: SiteContent) => void) {
    setC((prev) => {
      const next = structuredClone(prev);
      fn(next);
      return next;
    });
    setStatus({ kind: "dirty" });
  }

  function save() {
    setStatus({ kind: "saving" });
    startTransition(async () => {
      const res = await saveSiteContent(c);
      setStatus(res.ok ? { kind: "saved" } : { kind: "error", text: res.error });
    });
  }

  return (
    <div className={styles.editor}>
      <h2 className={styles.group}>Forsiden</h2>

      <Section title="Toppen" hint="Det første besøkende ser.">
        <Field id="hero-eyebrow" label="Liten tekst over overskriften" value={c.hero.eyebrow} onChange={(v) => edit((d) => { d.hero.eyebrow = v; })} />
        <Field id="hero-title" label="Overskrift" value={c.hero.title} onChange={(v) => edit((d) => { d.hero.title = v; })} />
        <Field id="hero-lede" label="Ingress" multiline value={c.hero.lede} onChange={(v) => edit((d) => { d.hero.lede = v; })} />
        <div className={styles.row2}>
          <Field id="hero-cta1" label="Svart knapp (går til kontakt)" value={c.hero.primaryCta} onChange={(v) => edit((d) => { d.hero.primaryCta = v; })} />
          <Field id="hero-cta2" label="Hvit knapp (går til tjenester)" value={c.hero.secondaryCta} onChange={(v) => edit((d) => { d.hero.secondaryCta = v; })} />
        </div>
      </Section>

      <Section title="Hva vi hjelper med">
        <Field id="goals-title" label="Overskrift" value={c.goals.title} onChange={(v) => edit((d) => { d.goals.title = v; })} />
        <TitleTextList
          idPrefix="goal"
          items={c.goals.items}
          itemName="boks"
          onChange={(fn) => edit((d) => fn(d.goals.items))}
        />
        <Field id="goals-button" label="Knapp under boksene" value={c.goals.button} onChange={(v) => edit((d) => { d.goals.button = v; })} />
      </Section>

      <Section title="Nye ideer sammen">
        <Field id="ideas-eyebrow" label="Liten tekst over overskriften" value={c.ideas.eyebrow} onChange={(v) => edit((d) => { d.ideas.eyebrow = v; })} />
        <Field id="ideas-title" label="Overskrift" value={c.ideas.title} onChange={(v) => edit((d) => { d.ideas.title = v; })} />
        <ListEditor
          items={c.ideas.paragraphs}
          itemName="avsnitt"
          newItem=""
          onChange={(fn) => edit((d) => fn(d.ideas.paragraphs))}
          render={(p, i, set) => (
            <Field id={`idea-${i}`} label={`Avsnitt ${i + 1}`} multiline value={p} onChange={set} />
          )}
        />
      </Section>

      <Section title="Slik jobber vi">
        <Field id="steps-title" label="Overskrift" value={c.steps.title} onChange={(v) => edit((d) => { d.steps.title = v; })} />
        <TitleTextList idPrefix="step" items={c.steps.items} itemName="steg" onChange={(fn) => edit((d) => fn(d.steps.items))} />
      </Section>

      <h2 className={styles.group}>Tjenestesiden</h2>

      <Section title="Toppen av tjenestesiden">
        <Field id="srv-eyebrow" label="Liten tekst over overskriften" value={c.services.eyebrow} onChange={(v) => edit((d) => { d.services.eyebrow = v; })} />
        <Field id="srv-title" label="Overskrift" value={c.services.title} onChange={(v) => edit((d) => { d.services.title = v; })} />
        <Field id="srv-lede" label="Ingress" multiline value={c.services.lede} onChange={(v) => edit((d) => { d.services.lede = v; })} />
      </Section>

      <Section title="Tjenester" hint="Hver tjeneste blir en boks. Bruk pilene for å endre rekkefølgen.">
        <ListEditor<Offer>
          items={c.services.offers}
          itemName="tjeneste"
          newItem={{ tag: "", title: "Ny tjeneste", text: "", points: [], soon: false }}
          onChange={(fn) => edit((d) => fn(d.services.offers))}
          render={(o, i, set) => (
            <div className={styles.stack}>
              <div className={styles.row2}>
                <Field id={`offer-${i}-title`} label="Navn" value={o.title} onChange={(v) => set({ ...o, title: v })} />
                <Field id={`offer-${i}-tag`} label="Liten etikett (f.eks. Synlighet)" value={o.tag} onChange={(v) => set({ ...o, tag: v })} />
              </div>
              <Field id={`offer-${i}-text`} label="Beskrivelse" multiline value={o.text} onChange={(v) => set({ ...o, text: v })} />
              <Field
                id={`offer-${i}-points`}
                label="Punkter (ett per linje)"
                multiline
                value={o.points.join("\n")}
                onChange={(v) => set({ ...o, points: v.split("\n") })}
              />
              <label className={styles.check}>
                <input type="checkbox" id={`offer-${i}-soon`} checked={o.soon} onChange={(e) => set({ ...o, soon: e.target.checked })} />
                Vis som «Kommer snart»
              </label>
            </div>
          )}
        />
      </Section>

      <Section title="Priser">
        <Field id="prices-title" label="Overskrift" value={c.prices.title} onChange={(v) => edit((d) => { d.prices.title = v; })} />
        <Field id="prices-lede" label="Tekst over prisene" multiline value={c.prices.lede} onChange={(v) => edit((d) => { d.prices.lede = v; })} />
        <ListEditor<PriceItem>
          items={c.prices.items}
          itemName="pris"
          newItem={{ label: "", price: "" }}
          onChange={(fn) => edit((d) => fn(d.prices.items))}
          render={(p, i, set) => (
            <div className={styles.row2}>
              <Field id={`price-${i}-label`} label="Hva (f.eks. 1 kort)" value={p.label} onChange={(v) => set({ ...p, label: v })} />
              <Field id={`price-${i}-price`} label="Pris (f.eks. 500 kr)" value={p.price} onChange={(v) => set({ ...p, price: v })} />
            </div>
          )}
        />
        <Field id="prices-note" label="Tekst under prisene" multiline value={c.prices.note} onChange={(v) => edit((d) => { d.prices.note = v; })} />
      </Section>

      <h2 className={styles.group}>På begge sidene</h2>

      <Section title="Kontakt">
        <Field id="contact-title" label="Overskrift" value={c.contact.title} onChange={(v) => edit((d) => { d.contact.title = v; })} />
        <Field id="contact-lede" label="Tekst" multiline value={c.contact.lede} onChange={(v) => edit((d) => { d.contact.lede = v; })} />
        <div className={styles.row2}>
          <Field id="contact-email" label="E-post" value={c.contact.email} onChange={(v) => edit((d) => { d.contact.email = v; })} />
          <Field id="contact-phone" label="Telefon" value={c.contact.phone} onChange={(v) => edit((d) => { d.contact.phone = v; })} />
        </div>
      </Section>

      <Section title="Bunnen av siden">
        <Field id="footer-tagline" label="Tekst i bunnen" value={c.footer.tagline} onChange={(v) => edit((d) => { d.footer.tagline = v; })} />
      </Section>

      <div className={styles.saveBar}>
        <button type="button" className="btn" onClick={save} disabled={!dirty}>
          {status.kind === "saving" ? "Lagrer …" : "Lagre"}
        </button>
        <span role="status" className={status.kind === "error" ? "msg msg-error" : status.kind === "saved" ? "msg msg-ok" : "msg"}>
          {status.kind === "dirty" && "Du har endringer som ikke er lagret"}
          {status.kind === "saved" && "Lagret. Nettsiden er oppdatert."}
          {status.kind === "error" && status.text}
        </span>
        <span className={styles.links}>
          <a href="/" target="_blank" rel="noreferrer" className="linkbtn">Se forsiden</a>
          <a href="/tjenester" target="_blank" rel="noreferrer" className="linkbtn">Se tjenestene</a>
        </span>
      </div>
    </div>
  );
}

/* ── Små byggeklosser ── */

function Section({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) {
  return (
    <details className={styles.section} open>
      <summary>
        <span>{title}</span>
        {hint && <small>{hint}</small>}
      </summary>
      <div className={styles.stack}>{children}</div>
    </details>
  );
}

function Field(props: { id: string; label: string; value: string; onChange: (v: string) => void; multiline?: boolean }) {
  return (
    <label className="field">
      {props.label}
      {props.multiline ? (
        <textarea className="input" id={props.id} rows={3} value={props.value} onChange={(e) => props.onChange(e.target.value)} />
      ) : (
        <input className="input" id={props.id} value={props.value} onChange={(e) => props.onChange(e.target.value)} />
      )}
    </label>
  );
}

/** Liste der elementer kan legges til, fjernes og flyttes opp/ned. */
function ListEditor<T>(props: {
  items: T[];
  itemName: string;
  newItem: T;
  onChange: (fn: (list: T[]) => void) => void;
  render: (item: T, index: number, set: (value: T) => void) => React.ReactNode;
}) {
  const { items, onChange } = props;
  return (
    <div className={styles.list}>
      {items.map((item, i) => (
        <div key={i} className={styles.item}>
          <div className={styles.itemBar}>
            <b>{props.itemName.charAt(0).toUpperCase() + props.itemName.slice(1)} {i + 1}</b>
            <span className={styles.itemActions}>
              <button type="button" aria-label="Flytt opp" disabled={i === 0} onClick={() => onChange((l) => { [l[i - 1], l[i]] = [l[i], l[i - 1]]; })}>↑</button>
              <button type="button" aria-label="Flytt ned" disabled={i === items.length - 1} onClick={() => onChange((l) => { [l[i + 1], l[i]] = [l[i], l[i + 1]]; })}>↓</button>
              <button type="button" className={styles.remove} onClick={() => onChange((l) => { l.splice(i, 1); })}>Fjern</button>
            </span>
          </div>
          {props.render(item, i, (value) => onChange((l) => { l[i] = value; }))}
        </div>
      ))}
      <button type="button" className={styles.add} onClick={() => onChange((l) => { l.push(structuredClone(props.newItem)); })}>
        + Legg til {props.itemName}
      </button>
    </div>
  );
}

function TitleTextList(props: {
  idPrefix: string;
  items: TitleText[];
  itemName: string;
  onChange: (fn: (list: TitleText[]) => void) => void;
}) {
  return (
    <ListEditor<TitleText>
      items={props.items}
      itemName={props.itemName}
      newItem={{ title: "", text: "" }}
      onChange={props.onChange}
      render={(it, i, set) => (
        <div className={styles.stack}>
          <Field id={`${props.idPrefix}-${i}-title`} label="Tittel" value={it.title} onChange={(v) => set({ ...it, title: v })} />
          <Field id={`${props.idPrefix}-${i}-text`} label="Tekst" multiline value={it.text} onChange={(v) => set({ ...it, text: v })} />
        </div>
      )}
    />
  );
}
