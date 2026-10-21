import type { Metadata } from "next";
import { AdminEditButton, ContactSection, SiteFooter, SiteHeader } from "@/components/site/SiteChrome";
import { getSiteContent } from "@/lib/siteContent";
import styles from "../home.module.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Tjenester · TapZon",
  description: "TapZon-kort, anmeldelser, følgere, klippekort og løsninger som bedriften styrer selv.",
};

export default async function ServicesPage() {
  const c = await getSiteContent();

  return (
    <div className={styles.site}>
      <SiteHeader />

      <main>
        <section className={styles.pageHero}>
          <div className={styles.inner}>
            {c.services.eyebrow && <p className={styles.eyebrow}>{c.services.eyebrow}</p>}
            <h1>{c.services.title}</h1>
            {c.services.lede && <p className={styles.lede}>{c.services.lede}</p>}
          </div>
        </section>

        {c.services.offers.length > 0 && (
          <section className={`${styles.section} ${styles.tinted}`}>
            <div className={styles.inner}>
              <div className={styles.offers} style={{ marginTop: 0 }}>
                {c.services.offers.map((o, i) => (
                  <article key={i} className={o.soon ? styles.offerSoon : undefined}>
                    <div className={styles.offerTop}>
                      <span className={styles.tag}>{o.tag}</span>
                      {o.soon && <span className={styles.soonBadge}>Kommer snart</span>}
                    </div>
                    <h3>{o.title}</h3>
                    <p>{o.text}</p>
                    {o.points.length > 0 && (
                      <ul>
                        {o.points.map((pt, j) => <li key={j}>{pt}</li>)}
                      </ul>
                    )}
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}

        {c.prices.items.length > 0 && (
          <section id="priser" className={styles.section}>
            <div className={styles.inner}>
              <h2>{c.prices.title}</h2>
              {c.prices.lede && <p className={styles.sectionLede}>{c.prices.lede}</p>}
              <div className={styles.prices}>
                {c.prices.items.map((p, i) => (
                  <div key={i}><span>{p.label}</span><b>{p.price}</b></div>
                ))}
              </div>
              {c.prices.note && <p className={styles.small}>{c.prices.note}</p>}
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
