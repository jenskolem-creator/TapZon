import Link from "next/link";
import { getMemberships, isPlatformAdmin, requireUser } from "@/lib/auth";
import { AdminHeader } from "@/components/AdminHeader";
import { MODULE_NAMES, type ModuleType } from "@/lib/types";
import styles from "./admin.module.css";

export const metadata = { title: "Dine brikker · TapZon" };

type CardRow = {
  id: string;
  business_id: string;
  label: string;
  title: string;
  module_type: ModuleType;
  is_active: boolean;
  style_looks: { count: number }[];
};

export default async function AdminHome() {
  const { supabase, user } = await requireUser();
  const [memberships, admin] = await Promise.all([getMemberships(), isPlatformAdmin()]);

  const { data: cards, error } = await supabase
    .from("cards")
    .select("id, business_id, label, title, module_type, is_active, style_looks(count)")
    .order("created_at", { ascending: true })
    .returns<CardRow[]>();
  if (error) throw error;

  return (
    <main className="wrap">
      <AdminHeader email={user.email} isAdmin={admin} />

      {memberships.length === 0 && (
        <div className="panel">
          <h2>Du er ikke koblet til en butikk ennå</h2>
          <p className="hint">Ta kontakt med TapZon, så kobler vi kontoen din til butikken.</p>
        </div>
      )}

      {memberships.map((m) => {
        const own = (cards ?? []).filter((c) => c.business_id === m.business_id);
        return (
          <section key={m.business_id} className={styles.section}>
            <div className="row" style={{ justifyContent: "space-between", alignItems: "flex-end" }}>
              <div>
                <h1>{m.businesses.name}</h1>
                <p className="hint">Hver brikke henger ved ett plagg. Velg brikken du vil endre.</p>
              </div>
              {m.role === "owner" && (
                <Link className="btn btn-ghost" href={`/admin/butikk?id=${m.business_id}`}>Logo og farge</Link>
              )}
            </div>

            {own.length === 0 ? (
              <p className="hint">Butikken har ingen brikker ennå.</p>
            ) : (
              <div className={styles.cards}>
                {own.map((c) => (
                  <Link key={c.id} href={`/admin/kort/${c.id}`} className={styles.card}>
                    <span className="mono" style={{ color: "var(--accent)" }}>/k/{c.id}</span>
                    <b>{c.title || "Uten navn"}</b>
                    <span>{c.label || MODULE_NAMES[c.module_type]}</span>
                    <span>
                      {c.module_type === "style" ? `${c.style_looks[0]?.count ?? 0} forslag` : MODULE_NAMES[c.module_type]}
                      {!c.is_active && " · Ikke i bruk"}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </section>
        );
      })}
    </main>
  );
}
