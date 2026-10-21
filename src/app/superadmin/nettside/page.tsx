import Link from "next/link";
import { requireSuperadmin } from "@/lib/auth";
import { getSiteContent } from "@/lib/siteContent";
import { AdminHeader } from "@/components/AdminHeader";
import { SiteEditor } from "./SiteEditor";

export const metadata = { title: "Rediger nettsiden · TapZon" };

export default async function EditSitePage() {
  const { user } = await requireSuperadmin();
  const content = await getSiteContent();

  return (
    <main className="wrap" style={{ maxWidth: 860 }}>
      <AdminHeader email={user.email} isAdmin />
      <Link className="linkbtn" href="/superadmin">&larr; Superadmin</Link>
      <h1 style={{ margin: "14px 0 6px" }}>Rediger nettsiden</h1>
      <p className="hint" style={{ marginBottom: 24 }}>
        Endre teksten på forsiden og tjenestesiden. Trykk «Lagre» nederst, så vises endringene med en gang.
        Et tomt felt skjules på siden.
      </p>
      <SiteEditor initial={content} />
    </main>
  );
}
