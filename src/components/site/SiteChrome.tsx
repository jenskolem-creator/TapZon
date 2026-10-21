import Link from "next/link";
import styles from "@/app/home.module.css";

export const EMAIL = "tapzonreview@gmail.com";
export const PHONE = "+47 941 09 011";

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

/** Kontaktfeltet nederst på de offentlige sidene. */
export function ContactSection() {
  return (
    <section id="kontakt" className={`${styles.section} ${styles.contact}`}>
      <div className={styles.inner}>
        <h2>La oss snakke sammen</h2>
        <p className={styles.sectionLede}>
          Fortell oss litt om bedriften og hva dere ønsker, så finner vi ut hva som gir dere mest.
        </p>
        <div className={styles.contactRow}>
          <a href={`mailto:${EMAIL}?subject=TapZon`} className={styles.contactCard}>
            <small>E-post</small>
            <span>{EMAIL}</span>
          </a>
          <a href={`tel:${PHONE.replace(/\s/g, "")}`} className={styles.contactCard}>
            <small>Telefon</small>
            <span>{PHONE}</span>
          </a>
        </div>
      </div>
    </section>
  );
}

export function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <div className={`${styles.inner} ${styles.footerInner}`}>
        <span className={styles.brand}>TapZon</span>
        <span>Teknologi og markedsføring for lokale bedrifter</span>
        <Link href="/admin">Logg inn som butikkeier</Link>
      </div>
    </footer>
  );
}
