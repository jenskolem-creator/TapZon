import Link from "next/link";
import { redirect } from "next/navigation";
import { getMemberships, requireUser } from "@/lib/auth";
import { AdminHeader } from "@/components/AdminHeader";
import { BusinessForm } from "./BusinessForm";

export const metadata = { title: "Butikken · TapZon" };

export default async function BusinessPage(props: PageProps<"/admin/butikk">) {
  const { user } = await requireUser();
  const sp = await props.searchParams;
  const memberships = await getMemberships();
  const m = memberships.find((x) => x.business_id === sp.id) ?? memberships[0];
  if (!m || m.role !== "owner") redirect("/admin");

  return (
    <main className="wrap" style={{ maxWidth: 640 }}>
      <AdminHeader email={user.email} />
      <Link className="linkbtn" href="/admin">&larr; Alle brikker</Link>
      <h1 style={{ margin: "14px 0 6px" }}>Butikken</h1>
      <p className="hint" style={{ marginBottom: 20 }}>Navn, logo og farge vises øverst på alle brikkene deres.</p>
      <BusinessForm
        businessId={m.business_id}
        initial={{
          name: m.businesses.name,
          accent_color: m.businesses.accent_color ?? "#6b2433",
          logo_path: m.businesses.logo_path,
        }}
      />
    </main>
  );
}
