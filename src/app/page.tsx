import type { Metadata } from "next";
import Link from "next/link";
import { StyleCardView } from "@/components/StyleCardView";
import styles from "./home.module.css";

export const metadata: Metadata = {
  title: "TapZon · Teknologi og markedsføring for lokale bedrifter",
  description:
    "TapZon hjelper lokale bedrifter med flere anmeldelser, flere følgere og smarte digitale løsninger som de styrer selv.",
};

const EMAIL = "tapzonreview@gmail.com";
const PHONE = "+47 941 09 011";

type Offer = { tag: string; title: string; text: string; points: string[]; soon?: boolean };

const OFFERS: Offer[] = [
  {
    tag: "Synlighet",
    title: "Flere anmeldelser og følgere",
    text: "NFC-kort som sender kunden rett dit dere vil, med ett tapp på telefonen.",
    points: ["Google-anmeldelser", "Instagram, Facebook og TikTok", "Tripadvisor, meny eller egen nettside"],
  },
  {
    tag: "Plattform",
    title: "Smarte kort dere styrer selv",
    text: "Hvert kort har sin egen side. Dere logger inn og endrer innholdet når dere vil, uten å bytte kortet.",
    points: ["Endre tekst og bilder fra mobilen", "Endringer vises med en gang", "Ett kort, én side, ingen forvirring"],
  },
  {
    tag: "For klesbutikker",
    title: "TapZon Style",
    text: "Et kort ved hvert plagg. Kunden tapper og får stylingforslag og farger som passer til akkurat det plagget.",
    points: ["Bilder av ferdige antrekk", "Farger som passer til", "Butikken oppdaterer selv"],
  },
  {
    tag: "Lojalitet",
    title: "Digitale klippekort",
    text: "Stempelkort rett på telefonen. Ett stempel per besøk, godkjent av de ansatte ved kassen.",
    points: ["Ingen papirkort å miste", "Kunden husket automatisk", "Belønning når kortet er fullt"],
    soon: true,
  },
  {
    tag: "Innhold",
    title: "Egen side bak kortet",
    text: "Meny, åpningstider og hemmelige tilbud som bare vises for dem som tapper kortet.",
    points: ["Dere skriver innholdet selv", "Perfekt for kaféer og frisører", "Bytt tilbud så ofte dere vil"],
    soon: true,
  },
  {
    tag: "Skreddersøm",
    title: "Har dere en idé?",
    text: "Vi utvikler stadig nye løsninger innen teknologi og markedsføring for lokale bedrifter. Fortell oss hva dere trenger.",
    points: ["Vi tar en uforpliktende prat", "Vi foreslår en løsning", "Dere får noe som passer dere"],
  },
];

/** Nøytral illustrasjon til eksempelet (ekte butikker laster opp egne bilder). */
function sampleImage(from: string, to: string) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${from}"/><stop offset="1" stop-color="${to}"/></linearGradient></defs><rect width="400" height="500" fill="url(#g)"/><path d="M120 90 L200 140 L280 90 L320 150 L280 175 L280 400 L120 400 L120 175 L80 150 Z" fill="rgba(255,255,255,.14)" stroke="rgba(255,255,255,.75)" stroke-width="5" stroke-linejoin="round"/><path d="M200 140 L178 230 M200 140 L222 230" stroke="rgba(255,255,255,.75)" stroke-width="5"/></svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

export default function Home() {
  return (
    <div className={styles.site}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <Link href="/" className={styles.brand}>TapZon</Link>
          <nav className={styles.nav} aria-label="Hovedmeny">
            <a href="#tilbud">Hva vi tilbyr</a>
            <a href="#plattform">Plattformen</a>
            <a href="#slik">Slik jobber vi</a>
            <a href="#priser">Priser</a>
            <a href="#kontakt">Kontakt</a>
          </nav>
          <Link href="/admin" className={styles.loginBtn}>Logg inn som butikkeier</Link>
        </div>
      </header>

      <main>
        {/* ── Hero ── */}
        <section className={styles.hero}>
          <div className={styles.inner}>
            <p className={styles.eyebrow}>Teknologi og markedsføring for lokale bedrifter</p>
            <h1>Vi hjelper bedrifter å bli sett, valgt og husket.</h1>
            <p className={styles.lede}>
              TapZon lager smarte kort og digitale verktøy som gir dere flere anmeldelser, flere følgere
              og bedre kundeopplevelser. Og dere styrer alt selv.
            </p>
            <div className={styles.ctaRow}>
              <a href="#kontakt" className={styles.btnPrimary}>Ta kontakt</a>
              <a href="#tilbud" className={styles.btnGhost}>Se hva vi tilbyr</a>
            </div>
          </div>
        </section>

        {/* ── Tilbud ── */}
        <section id="tilbud" className={`${styles.section} ${styles.tinted}`}>
          <div className={styles.inner}>
            <h2>Dette tilbyr vi</h2>
            <p className={styles.sectionLede}>
              Fra flere stjerner på Google til digitale løsninger kundene faktisk bruker.
            </p>
            <div className={styles.offers}>
              {OFFERS.map((o) => (
                <article key={o.title} className={o.soon ? styles.offerSoon : undefined}>
                  <div className={styles.offerTop}>
                    <span className={styles.tag}>{o.tag}</span>
                    {o.soon && <span className={styles.soonBadge}>Kommer snart</span>}
                  </div>
                  <h3>{o.title}</h3>
                  <p>{o.text}</p>
                  <ul>
                    {o.points.map((pt) => <li key={pt}>{pt}</li>)}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ── Plattformen ── */}
        <section id="plattform" className={styles.section}>
          <div className={`${styles.inner} ${styles.split}`}>
            <div>
              <p className={styles.eyebrow}>Plattformen</p>
              <h2>Dere har kontrollen</h2>
              <p className={styles.sectionLede}>
                Alle TapZon-kort er koblet til vår plattform. Bedriftseieren logger inn og endrer det kundene ser,
                uten å kunne kode og uten å vente på oss.
              </p>
              <dl className={styles.facts}>
                <div>
                  <dt>Logg inn</dt>
                  <dd>Med e-post og passord, på mobil eller PC.</dd>
                </div>
                <div>
                  <dt>Velg kort</dt>
                  <dd>Hvert fysiske kort har sin egen side.</dd>
                </div>
                <div>
                  <dt>Endre og lagre</dt>
                  <dd>Neste kunde som tapper, ser det nye innholdet.</dd>
                </div>
              </dl>
              <div className={styles.ctaRow}>
                <Link href="/admin" className={styles.btnGhost}>Logg inn som butikkeier</Link>
              </div>
            </div>
            <figure className={styles.phoneWrap}>
              <div className={styles.phone}>
                <div className={styles.screen}>
                  <StyleCardView
                    storeName="Din butikk"
                    logoUrl={null}
                    accentColor="#111214"
                    title="Ullblazer i kamel"
                    looks={[
                      {
                        imageUrl: sampleImage("#cfcac2", "#9c968c"),
                        caption: "Til kontoret: over en hvit skjorte med rette, mørke bukser og loafers.",
                        colors: [
                          { hex: "#17171a", label: "Sort" },
                          { hex: "#f4f1ea", label: "Offwhite" },
                          { hex: "#25324a", label: "Marine" },
                        ],
                      },
                      {
                        imageUrl: sampleImage("#2b2b30", "#6e6a62"),
                        caption: "Til middag: åpen over en silketopp, med gullsmykker.",
                        colors: [
                          { hex: "#6b2433", label: "Bordeaux" },
                          { hex: "#b8955a", label: "Gull" },
                        ],
                      },
                    ]}
                  />
                </div>
              </div>
              <figcaption>Eksempel: det kunden ser etter å ha tappet kortet ved et plagg.</figcaption>
            </figure>
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
                <p>Dere forteller hva dere vil oppnå: flere anmeldelser, flere følgere eller noe helt eget.</p>
              </li>
              <li>
                <span className={styles.stepNo}>2</span>
                <h3>Vi setter det opp</h3>
                <p>Vi leverer kortene ferdig programmert og gjør plattformen klar for dere.</p>
              </li>
              <li>
                <span className={styles.stepNo}>3</span>
                <h3>Dere styrer, vi hjelper</h3>
                <p>Dere oppdaterer innholdet selv. Trenger dere hjelp eller nye ideer, er vi en telefon unna.</p>
              </li>
            </ol>
          </div>
        </section>

        {/* ── Priser ── */}
        <section id="priser" className={styles.section}>
          <div className={styles.inner}>
            <h2>TapZon-kort</h2>
            <p className={styles.sectionLede}>
              Kortene finnes som sticker (10,5 × 7 cm, står eller limes fast) og i bordstativ. Samme pris for begge.
            </p>
            <div className={styles.prices}>
              <div><span>1 kort</span><b>500 kr</b></div>
              <div><span>2 kort</span><b>800 kr</b></div>
              <div><span>3 kort</span><b>1 000 kr</b></div>
            </div>
            <p className={styles.small}>
              Flere kort, TapZon Style eller andre løsninger? Ta kontakt, så lager vi et tilbud som passer dere.
            </p>
          </div>
        </section>

        {/* ── Kontakt ── */}
        <section id="kontakt" className={`${styles.section} ${styles.contact}`}>
          <div className={styles.inner}>
            <h2>La oss snakke sammen</h2>
            <p className={styles.sectionLede}>
              Fortell oss litt om bedriften, så finner vi ut hva som gir dere mest.
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
      </main>

      <footer className={styles.footer}>
        <div className={`${styles.inner} ${styles.footerInner}`}>
          <span className={styles.brand}>TapZon</span>
          <span>Teknologi og markedsføring for lokale bedrifter</span>
          <Link href="/admin">Logg inn som butikkeier</Link>
        </div>
      </footer>
    </div>
  );
}
