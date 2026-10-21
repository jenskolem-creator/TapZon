import type { Metadata } from "next";
import Link from "next/link";
import { AdminEditButton, ContactSection, SiteFooter, SiteHeader } from "@/components/site/SiteChrome";
import { getSiteContent } from "@/lib/siteContent";
import styles from "./home.module.css";

// Teksten hentes fra databasen ved hvert besøk, så endringer fra /superadmin/nettside vises med en gang.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "TapZon · Teknologi og markedsføring for lokale bedrifter",
  description:
    "TapZon hjelper lokale bedrifter med flere anmeldelser, flere følgere og nye måter å få kunder inn og tilbake i butikken.",
};

export default async function Home() {
  const c = await getSiteContent();

  return (
    <div className={styles.site}>
      <SiteHeader />

      <main>
        {/* ── Hero ── */}
        <section className={styles.hero}>
          <div className={styles.inner}>
            {c.hero.eyebrow && <p className={styles.eyebrow}>{c.hero.eyebrow}</p>}
            <h1>{c.hero.title}</h1>
            {c.hero.lede && <p className={styles.lede}>{c.hero.lede}</p>}
            <div className={styles.ctaRow}>
              {c.hero.primaryCta && <a href="#kontakt" className={styles.btnPrimary}>{c.hero.primaryCta}</a>}
              {c.hero.secondaryCta && <Link href="/tjenester" className={styles.btnGhost}>{c.hero.secondaryCta}</Link>}
            </div>
          </div>
        </section>

        {/* ── Hva vi hjelper med ── */}
        {c.goals.items.length > 0 && (
          <section className={`${styles.section} ${styles.tinted}`}>
            <div className={styles.inner}>
              <h2>{c.goals.title}</h2>
              <div className={styles.goals}>
                {c.goals.items.map((g, i) => (
                  <div key={i}>
                    <h3>{g.title}</h3>
                    <p>{g.text}</p>
                  </div>
                ))}
              </div>
              {c.goals.button && (
                <div className={styles.ctaRow}>
                  <Link href="/tjenester" className={styles.btnGhost}>{c.goals.button}</Link>
                </div>
              )}
            </div>
          </section>
        )}

        {/* ── Nye ideer sammen ── */}
        <section id="ideer" className={styles.section}>
          <div className={`${styles.inner} ${styles.split2}`}>
            <div>
              {c.ideas.eyebrow && <p className={styles.eyebrow}>{c.ideas.eyebrow}</p>}
              <h2>{c.ideas.title}</h2>
            </div>
            <div className={styles.prose}>
              {c.ideas.paragraphs.map((p, i) => <p key={i}>{p}</p>)}
            </div>
          </div>
        </section>

        {/* ── Slik jobber vi ── */}
        {c.steps.items.length > 0 && (
          <section id="slik" className={`${styles.section} ${styles.tinted}`}>
            <div className={styles.inner}>
              <h2>{c.steps.title}</h2>
              <ol className={styles.steps}>
                {c.steps.items.map((s, i) => (
                  <li key={i}>
                    <span className={styles.stepNo}>{i + 1}</span>
                    <h3>{s.title}</h3>
                    <p>{s.text}</p>
                  </li>
                ))}
              </ol>
            </div>
          </section>
        )}

        <ContactSection contact={c.contact} />
      </main>

      <SiteFooter footer={c.footer} />
      <AdminEditButton />
    </div>
  );
}
