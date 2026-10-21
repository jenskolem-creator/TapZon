import Link from "next/link";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import type { SiteContent } from "@/lib/siteContentTypes";
import styles from "@/app/home.module.css";

/** Sant hvis den som ser på siden er innlogget plattform-admin (deg). Sjekker bare når det finnes en innlogging. */
async function viewerIsAdmin() {
  const hasSession = (await cookies()).getAll().some((c) => c.name.startsWith("sb-") && c.name.includes("auth-token"));
  if (!hasSession) return false;
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) return false;
  const { data: row } = await supabase.from("platform_admins").select("user_id").eq("user_id", data.user.id).maybeSingle();
  return Boolean(row);
}

/** Topp-menyen på de offentlige sidene. */
export function SiteHeader() {
  return (
    <header className={styles.header}>
      <div className={styles.headerInner}>
        <Link href="/" className={styles.brand}>TapZon</Link>
        <nav className={styles.nav} aria-label="Hovedmeny">
          <Link href="/tjenester">Tjenester</Link>
          <Link href="/#ideer">Nye ideer</Link>
          <Link href="/#slik">Slik jobber vi</Link>
          <Link href="/#kontakt">Kontakt</Link>
        </nav>
        <Link href="/admin" className={styles.loginBtn}>Logg inn som butikkeier</Link>
      </div>
    </header>
  );
}

/** Flytende «Rediger siden»-knapp som bare vises for deg. */
export async function AdminEditButton() {
  if (!(await viewerIsAdmin())) return null;
  return (
    <Link href="/superadmin/nettside" className={styles.editFab}>
      Rediger siden
    </Link>
  );
}

/** Kontaktfeltet nederst på de offentlige sidene. */
export function ContactSection({ contact }: { contact: SiteContent["contact"] }) {
  return (
    <section id="kontakt" className={`${styles.section} ${styles.contact}`}>
      <div className={styles.inner}>
        <h2>{contact.title}</h2>
        <p className={styles.sectionLede}>{contact.lede}</p>
        <div className={styles.contactRow}>
          {contact.email && (
            <a href={`mailto:${contact.email}?subject=TapZon`} className={styles.contactCard}>
              <small>E-post</small>
              <span>{contact.email}</span>
            </a>
          )}
          {contact.phone && (
            <a href={`tel:${contact.phone.replace(/\s/g, "")}`} className={styles.contactCard}>
              <small>Telefon</small>
              <span>{contact.phone}</span>
            </a>
          )}
        </div>
      </div>
    </section>
  );
}

export function SiteFooter({ footer }: { footer: SiteContent["footer"] }) {
  return (
    <footer className={styles.footer}>
      <div className={`${styles.inner} ${styles.footerInner}`}>
        <span className={styles.brand}>TapZon</span>
        <span>{footer.tagline}</span>
        <Link href="/admin">Logg inn som butikkeier</Link>
      </div>
    </footer>
  );
}
