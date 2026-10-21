import Link from "next/link";
import { requireSuperadmin } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/server";
import { AdminHeader } from "@/components/AdminHeader";
import { SimpleForm } from "@/components/SimpleForm";
import { createBusiness } from "./actions";
import styles from "./superadmin.module.css";

export const metadata = { title: "Superadmin · TapZon" };

export default async function SuperadminPage() {
  const { user } = await requireSuperadmin();
  const { data: businesses, error } = await createAdminClient()
    .from("businesses")
    .select("id, name, created_at, cards(count), business_members(count)")
    .order("created_at", { ascending: false })
    .returns<{ id: string; name: string; created_at: string; cards: { count: number }[]; business_members: { count: number }[] }[]>();
  if (error) throw error;

  return (
    <main className="wrap">
      <AdminHeader email={user.email} isAdmin />
      <div className="row" style={{ justifyContent: "space-between", alignItems: "flex-end", marginBottom: 8 }}>
        <h1>Butikker</h1>
        <Link href="/superadmin/nettside" className="btn btn-ghost">Rediger nettsiden</Link>
      </div>
      <p className="hint" style={{ marginBottom: 24 }}>
        Alle bedriftskunder på plattformen. En ny butikk er bare en ny rad, ingen ny kode.
      </p>

      <div className={styles.split}>
        <section className="panel">
          <h2 style={{ marginBottom: 14 }}>Ny butikk</h2>
          <SimpleForm
            action={createBusiness}
            submitLabel="Opprett butikk"
            fields={[
              { name: "name", label: "Butikkens navn", placeholder: "F.eks. Lin & Ull" },
              { name: "email", label: "Eierens e-post (får invitasjon)", type: "email", placeholder: "eier@butikk.no" },
              { name: "count", label: "Antall brikker å lage nå", type: "number", defaultValue: "5" },
            ]}
          />
        </section>

        <section>
          {(businesses ?? []).length === 0 ? (
            <p className="hint">Ingen butikker ennå. Opprett den første til venstre.</p>
          ) : (
            <ul className={styles.list}>
              {businesses!.map((b) => (
                <li key={b.id}>
                  <Link href={`/superadmin/butikk/${b.id}`} className={styles.item}>
                    <b>{b.name}</b>
                    <span>
                      {b.cards[0]?.count ?? 0} brikker · {b.business_members[0]?.count ?? 0} personer
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
}
