import Link from "next/link";
import { signOut } from "@/app/admin/auth-actions";

export function AdminHeader({ email, isAdmin }: { email: string | undefined; isAdmin?: boolean }) {
  return (
    <header className="row" style={{ justifyContent: "space-between", marginBottom: 28 }}>
      <Link href="/admin" className="brand">TapZon</Link>
      <div className="row" style={{ gap: 16, fontSize: 13.5, color: "var(--ink-soft)" }}>
        {isAdmin && <Link className="linkbtn" href="/superadmin">Superadmin</Link>}
        <span>{email}</span>
        <form action={signOut}>
          <button className="linkbtn" type="submit">Logg ut</button>
        </form>
      </div>
    </header>
  );
}
