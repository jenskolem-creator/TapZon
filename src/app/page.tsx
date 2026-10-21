import type { Metadata } from "next";
import Link from "next/link";
import { ContactSection, SiteFooter, SiteHeader } from "@/components/site/SiteChrome";
import styles from "./home.module.css";

export const metadata: Metadata = {
  title: "TapZon · Teknologi og markedsføring for lokale bedrifter",
  description:
    "TapZon hjelper lokale bedrifter med flere anmeldelser, flere følgere og nye måter å få kunder inn og tilbake i butikken.",
};

const GOALS = [
  {
    title: "Bli funnet",
    text: "Flere anmeldelser på Google og flere følgere på Instagram, Facebook og TikTok, rett fra disken.",
  },
  {
    title: "Få kunder inn døra",
    text: "Løsninger som gjør butikken mer synlig og gir folk en grunn til å stikke innom.",
  },
  {
    title: "Få dem tilbake",
    text: "Digitale klippekort, tilbud og opplevelser som gjør at kundene kommer igjen.",
  },
];

export default function Home() {
  return (
    <div className={styles.site}>
      <SiteHeader />

      <main>
        {/* ── Hero ── */}
        <section className={styles.hero}>
          <div className={styles.inner}>
            <p className={styles.eyebrow}>Teknologi og markedsføring for lokale bedrifter</p>
            <h1>Vi hjelper bedrifter å bli sett, valgt og husket.</h1>
            <p className={styles.lede}>
              TapZon hjelper dere med det dere ønsker å få til, enten det er flere anmeldelser, flere følgere
              eller flere kunder som kommer tilbake. Dere styrer innholdet selv, og vi er med hele veien.
            </p>
            <div className={styles.ctaRow}>
              <a href="#kontakt" className={styles.btnPrimary}>Ta kontakt</a>
              <Link href="/tjenester" className={styles.btnGhost}>Se tjenestene</Link>
            </div>
          </div>
        </section>

        {/* ── Hva vi hjelper med ── */}
        <section className={`${styles.section} ${styles.tinted}`}>
          <div className={styles.inner}>
            <h2>Hva vi hjelper med</h2>
            <div className={styles.goals}>
              {GOALS.map((g) => (
                <div key={g.title}>
                  <h3>{g.title}</h3>
                  <p>{g.text}</p>
                </div>
              ))}
            </div>
            <div className={styles.ctaRow}>
              <Link href="/tjenester" className={styles.btnGhost}>Se alle tjenestene</Link>
            </div>
          </div>
        </section>

        {/* ── Nye ideer sammen ── */}
        <section id="ideer" className={styles.section}>
          <div className={`${styles.inner} ${styles.split2}`}>
            <div>
              <p className={styles.eyebrow}>Nye ideer, sammen</p>
              <h2>Vi finner på løsningene sammen med dere</h2>
            </div>
            <div className={styles.prose}>
              <p>
                Ingen butikker er like. Derfor starter vi med det dere ønsker: Hva skal til for at flere kunder
                finner veien inn? Hva får dem til å komme tilbake?
              </p>
              <p>
                Sammen kommer vi på nye måter å bruke teknologi og markedsføring på i akkurat deres bedrift.
                Noen ganger er det et TapZon-kort ved kassen. Andre ganger er det noe helt nytt som vi utvikler
                for dere.
              </p>
              <p>
                Og når løsningen er på plass, styrer dere den selv. Dere logger inn og endrer innholdet når dere vil,
                uten å kunne kode.
              </p>
            </div>
          </div>
        </section>

        {/* ── Slik jobber vi ── */}
        <section id="slik" className={`${styles.section} ${styles.tinted}`}>
          <div className={styles.inner}>
            <h2>Slik jobber vi</h2>
            <ol className={styles.steps}>
              <li>
                <span className={styles.stepNo}>1</span>
                <h3>Vi tar en prat</h3>
                <p>Dere forteller hva dere ønsker å oppnå, og vi kommer med forslag.</p>
              </li>
              <li>
                <span className={styles.stepNo}>2</span>
                <h3>Vi setter det opp</h3>
                <p>Vi leverer TapZon-kortene ferdig programmert og gjør løsningen klar for dere.</p>
              </li>
              <li>
                <span className={styles.stepNo}>3</span>
                <h3>Dere styrer, vi hjelper</h3>
                <p>Dere oppdaterer innholdet selv. Trenger dere hjelp eller nye ideer, er vi en telefon unna.</p>
              </li>
            </ol>
          </div>
        </section>

        <ContactSection />
      </main>

      <SiteFooter />
    </div>
  );
}
