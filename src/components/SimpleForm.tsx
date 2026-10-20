"use client";

import { useActionState } from "react";

type FormState = { error?: string; ok?: string } | undefined;
type Field = {
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
  defaultValue?: string;
  autoComplete?: string;
  options?: { value: string; label: string }[];
};

/** Generelt skjema: felter inn, melding ut. Brukes til innlogging og i superadmin. */
export function SimpleForm({
  action,
  fields,
  submitLabel,
  hidden,
  compact,
}: {
  action: (prev: FormState, data: FormData) => Promise<FormState>;
  fields: Field[];
  submitLabel: string;
  hidden?: Record<string, string>;
  /** Liten lenkeknapp i stedet for stor knapp (for handlinger i lister). */
  compact?: boolean;
}) {
  const [state, formAction, pending] = useActionState(action, undefined);

  return (
    <form action={formAction} className="stack">
      {hidden && Object.entries(hidden).map(([k, v]) => <input key={k} type="hidden" name={k} value={v} />)}
      {fields.map((f) => (
        <label key={f.name} className="field">
          {f.label}
          {f.options ? (
            <select className="input" id={f.name} name={f.name} defaultValue={f.defaultValue}>
              {f.options.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          ) : (
            <input
              className="input"
              id={f.name}
              name={f.name}
              type={f.type ?? "text"}
              placeholder={f.placeholder}
              defaultValue={f.defaultValue}
              autoComplete={f.autoComplete}
              min={f.type === "number" ? 0 : undefined}
              max={f.type === "number" ? 200 : undefined}
              required
            />
          )}
        </label>
      ))}
      {state?.error && <p className="msg msg-error" role="alert">{state.error}</p>}
      {state?.ok && <p className="msg msg-ok" role="status">{state.ok}</p>}
      <button className={compact ? "linkbtn" : "btn"} type="submit" disabled={pending} style={compact ? { alignSelf: "flex-start" } : undefined}>
        {pending ? "Vent litt …" : submitLabel}
      </button>
    </form>
  );
}
