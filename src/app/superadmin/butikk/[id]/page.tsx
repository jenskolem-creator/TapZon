import Link from "next/link";
import { notFound } from "next/navigation";
import { requireSuperadmin } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/server";
import { cardUrl } from "@/lib/env";
import { MODULE_NAMES, type ModuleType } from "@/lib/types";
import { AdminHeader } from "@/components/AdminHeader";
import { SimpleForm } from "@/components/SimpleForm";
import { addCards, addMember, removeMember, resetMemberPassword, setCardActive } from "../../actions";
import styles from "../../superadmin.module.css";

export const metadata = { title: "Butikk · Superadmin · TapZon" };

export default async function SuperadminBusinessPage(props: PageProps<"/superadmin/butikk/[id]">) {
  const { id } = await props.params;
  const { user } = await requireSuperadmin();
  const admin = createAdminClient();

  const { data: business } = await admin.from("businesses").select("id, name").eq("id", id).maybeSingle();
  if (!business) notFound();

  const [{ data: cards }, { data: members }] = await Promise.all([
    admin
      .from("cards")
      .select("id, label, title, module_type, is_active")
      .eq("business_id", id)
      .order("created_at", { ascending: true })
      .returns<{ id: string; label: string; title: string; module_type: ModuleType; is_active: boolean }[]>(),
    admin.from("business_members").select("user_id, role").eq("business_id", id),
  ]);

  const people = await Promise.all(
    (members ?? []).map(async (m) => {
      const { data } = await admin.auth.admin.getUserById(m.user_id);
      return { ...m, email: data.user?.email ?? "(ukjent)", pending: Boolean(data.user?.user_metadata?.must_change_password) };
    }),
  );

  const urls = (cards ?? []).map((c) => cardUrl(c.id)).join("\n");

  return (
    <main className="wrap">
      <AdminHeader email={user.email} isAdmin />
      <Link className="linkbtn" href="/superadmin">&larr; Alle butikker</Link>
      <h1 style={{ margin: "14px 0 24px" }}>{business.name}</h1>

      <div className={styles.split} style={{ gridTemplateColumns: "minmax(0, 1fr) 320px" }}>
        <section className="stack">
          <h2>Brikker ({cards?.length ?? 0})</h2>
          {(cards ?? []).length > 0 ? (
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Adresse (skriv denne på NFC-kortet)</th>
                    <th>Plagg / innhold</th>
                    <th>Type</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {cards!.map((c) => (
                    <tr key={c.id} className={c.is_active ? undefined : styles.off}>
                      <td>
                        <a className="mono" href={`/k/${c.id}`} target="_blank" rel="noreferrer">{cardUrl(c.id)}</a>
                      </td>
                      <td>{c.title || "–"}{c.label && <span className={styles.off}> · {c.label}</span>}</td>
                      <td>{MODULE_NAMES[c.module_type]}</td>
                      <td>
                        <form action={setCardActive}>
                          <input type="hidden" name="business_id" value={id} />
                          <input type="hidden" name="card_id" value={c.id} />
                          <input type="hidden" name="active" value={String(!c.is_active)} />
                          <button className="linkbtn" type="submit">
                            {c.is_active ? "Aktiv · deaktiver" : "Ikke i bruk · aktiver"}
                          </button>
                        </form>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="hint">Ingen brikker ennå.</p>
          )}

          {urls && (
            <label className="field">
              Alle adresser, én per linje (for å kopiere til NFC-appen)
              <textarea className="input mono" id="urls" readOnly rows={Math.min(10, cards!.length)} value={urls} />
            </label>
          )}
        </section>

        <aside className={styles.side}>
          <section className="panel">
            <h2 style={{ marginBottom: 14 }}>Lag flere brikker</h2>
            <SimpleForm
              action={addCards}
              hidden={{ business_id: id }}
              submitLabel="Lag brikker"
              fields={[
                { name: "count", label: "Antall", type: "number", defaultValue: "5" },
                {
                  name: "module_type",
                  label: "Type",
                  defaultValue: "style",
                  options: (Object.keys(MODULE_NAMES) as ModuleType[]).map((k) => ({ value: k, label: MODULE_NAMES[k] })),
                },
              ]}
            />
          </section>

          <section className="panel stack">
            <h2>Personer med tilgang</h2>
            <ul className={styles.members}>
              {people.map((p) => (
                <li key={p.user_id}>
                  <span>
                    {p.email} <span className={styles.off}>· {p.role === "owner" ? "eier" : "ansatt"}{p.pending && " · har ikke laget eget passord"}</span>
                  </span>
                  <form action={removeMember}>
                    <input type="hidden" name="business_id" value={id} />
                    <input type="hidden" name="user_id" value={p.user_id} />
                    <button className="linkbtn" type="submit">Fjern</button>
                  </form>
                  <div style={{ flexBasis: "100%" }}>
                    <SimpleForm
                      action={resetMemberPassword}
                      hidden={{ user_id: p.user_id }}
                      fields={[]}
                      submitLabel="Gi nytt midlertidig passord"
                      compact
                    />
                  </div>
                </li>
              ))}
            </ul>
            <SimpleForm
              action={addMember}
              hidden={{ business_id: id }}
              submitLabel="Gi tilgang"
              fields={[
                { name: "email", label: "E-post", type: "email", placeholder: "navn@butikk.no" },
                {
                  name: "role",
                  label: "Rolle",
                  defaultValue: "owner",
                  options: [
                    { value: "owner", label: "Eier (kan også endre logo og farge)" },
                    { value: "staff", label: "Ansatt (endrer brikker)" },
                  ],
                },
              ]}
            />
          </section>
        </aside>
      </div>
    </main>
  );
}
