import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { StyleCardView } from "@/components/StyleCardView";
import styles from "./home.module.css";

export const metadata: Metadata = {
  title: "TapZon · NFC-kort for lokale bedrifter",
  description:
    "Kunden holder telefonen mot et TapZon-kort og havner rett på Google-anmeldelsen, Instagram eller en side dere styrer selv.",
};

const EMAIL = "tapzonreview@gmail.com";
const PHONE = "+47 941 09 011";

const PLATFORMS = [
  { name: "Google", color: "var(--c-blue)", text: "Åpner skjemaet for å skrive en anmeldelse, klart for stjerner og tekst." },
  { name: "Instagram", color: "var(--c-red)", text: "Åpner profilen deres, så kunden kan trykke «Følg» med en gang." },
  { name: "Facebook", color: "var(--c-blue)", text: "Åpner siden deres for å følge, like eller skrive en anbefaling." },
  { name: "TikTok", color: "var(--c-green)", text: "Åpner profilen deres, så kunden finner videoene og følger." },
  { name: "Tripadvisor", color: "var(--c-green)", text: "For hoteller og restauranter som vil ha flere vurderinger der." },
  { name: "Egen lenke", color: "var(--c-yellow)", text: "Meny, nettside, bestilling eller hva dere vil sende kunden til." },
];

const AUDIENCE = [
  "Kaféer og restauranter",
  "Frisører og barbershops",
  "Klesbutikker",
  "Hoteller",
  "Klinikker og helse",
  "Treningssentre",
  "Andre lokale bedrifter",
];

/** Illustrasjon til eksempelet på Style-kortet (ekte butikker laster opp egne bilder). */
function sampleImage(from: string, to: string) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${from}"/><stop offset="1" stop-color="${to}"/></linearGradient></defs><rect width="400" height="500" fill="url(#g)"/><path d="M120 90 L200 140 L280 90 L320 150 L280 175 L280 400 L120 400 L120 175 L80 150 Z" fill="rgba(255,255,255,.16)" stroke="rgba(255,255,255,.8)" stroke-width="5" stroke-linejoin="round"/><path d="M200 140 L178 230 M200 140 L222 230" stroke="rgba(255,255,255,.8)" stroke-width="5"/></svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

export default function Home() {
  return (
    <div className={styles.site}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <Link href="/" className={styles.brand} aria-label="TapZon, til forsiden">
            <Image src="/assets/tapzon-mark.png" alt="" width={36} height={22} priority />
            <span>TapZon</span>
          </Link>
          <nav className={styles.nav} aria-label="Hovedmeny">
            <a href="#slik">Slik virker det</a>
            <a href="#plattformer">Google og sosiale medier</a>
            <a href="#style">For klesbutikker</a>
            <a href="#produkter">Produkter</a>
            <a href="#kontakt">Kontakt</a>
          </nav>
          <Link href="/admin" className={styles.loginBtn}>Logg inn som butikkeier</Link>
        </div>
      </header>

      <main>
        {/* ── Hero ── */}
        <section className={styles.hero}>
          <div className={styles.inner}>
            <div className={styles.heroText}>
              <p className={styles.eyebrow}>NFC-kort for lokale bedrifter</p>
              <h1>Ett tapp, og kunden er der du vil ha dem.</h1>
              <p className={styles.lede}>
                Kunden holder telefonen mot et TapZon-kort og havner rett på Google-anmeldelsen,
                Instagram-profilen eller en side dere styrer selv. Ingen app og ingen QR-kode.
              </p>
              <div className={styles.ctaRow}>
                <a href="#kontakt" className={styles.btnPrimary}>Bestill kort</a>
                <a href="#slik" className={styles.btnGhost}>Se hvordan det virker</a>
              </div>
            </div>
            <div className={styles.heroImage}>
              <Image
                src="/assets/photo-stand.webp"
                alt="TapZon-stativ på et restaurantbord"
                width={1200}
                height={1200}
                priority
                sizes="(max-width: 860px) 100vw, 520px"
              />
            </div>
          </div>
        </section>

        {/* ── Slik virker det ── */}
        <section id="slik" className={styles.section}>
          <div className={styles.inner}>
            <h2>Slik virker det</h2>
            <ol className={styles.steps}>
              <li>
                <span className={styles.stepNo} style={{ background: "var(--c-blue)" }}>1</span>
                <h3>Kunden holder telefonen mot kortet</h3>
                <p>Kortet har en NFC-brikke, samme teknologi som når du betaler med mobilen.</p>
              </li>
              <li>
                <span className={styles.stepNo} style={{ background: "var(--c-red)" }}>2</span>
                <h3>Riktig side åpnes med en gang</h3>
                <p>Telefonen åpner lenken som ligger på kortet. Ingen søk, ingen app å laste ned.</p>
              </li>
              <li>
                <span className={styles.stepNo} style={{ background: "var(--c-green)" }}>3</span>
                <h3>Kunden gjør resten</h3>
                <p>Skriver en anmeldelse, følger dere, eller ser innholdet dere har lagt ut.</p>
              </li>
            </ol>
          </div>
        </section>

        {/* ── Google og sosiale medier ── */}
        <section id="plattformer" className={`${styles.section} ${styles.tinted}`}>
          <div className={styles.inner}>
            <p className={styles.eyebrow}>TapZon Review</p>
            <h2>Flere anmeldelser og følgere</h2>
            <p className={styles.sectionLede}>
              Vi programmerer kortet til den siden dere vil at kundene skal havne på.
              Fornøyde kunder kan gi dere en anmeldelse eller en ny følger mens opplevelsen er fersk.
            </p>
            <ul className={styles.platforms}>
              {PLATFORMS.map((p) => (
                <li key={p.name}>
                  <span className={styles.dot} style={{ background: p.color }} />
                  <h3>{p.name}</h3>
                  <p>{p.text}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ── TapZon Style ── */}
        <section id="style" className={styles.section}>
          <div className={`${styles.inner} ${styles.split}`}>
            <div>
              <p className={styles.eyebrow}>TapZon Style · for klesbutikker</p>
              <h2>Et kort ved hvert plagg</h2>
              <p className={styles.sectionLede}>
                Kunden tapper kortet som henger ved plagget og får opp stylingforslag for akkurat det plagget:
                bilder av ferdige antrekk og hvilke farger som passer til.
              </p>
              <ul className={styles.checks}>
                <li>Hvert kort viser bare sitt eget plagg. Kunden blar ikke bort.</li>
                <li>Butikken laster opp bilder og skriver tekst selv, rett fra mobilen.</li>
                <li>Endringer vises med en gang. Kortet byttes aldri.</li>
                <li>Nytt plagg på stativet? Bare skriv inn det nye innholdet på samme kort.</li>
              </ul>
              <div className={styles.ctaRow}>
                <a href="#kontakt" className={styles.btnPrimary}>Jeg vil vite mer</a>
                <Link href="/admin" className={styles.btnGhost}>Logg inn som butikkeier</Link>
              </div>
            </div>
            <div className={styles.phone} aria-label="Eksempel på det kunden ser etter et tapp">
              <div className={styles.screen}>
                <StyleCardView
                  storeName="Din butikk"
                  logoUrl={null}
                  accentColor="#2f6fde"
                  title="Ullblazer i kamel"
                  looks={[
                    {
                      imageUrl: sampleImage("#d9cfc0", "#a99a83"),
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
          </div>

          <div className={`${styles.inner} ${styles.soon}`}>
            <div>
              <span className={styles.badge}>Kommer snart</span>
              <h3>Stempelkort</h3>
              <p>Digitalt stempelkort på telefonen. Ett stempel per besøk, godkjent av de ansatte ved kassen.</p>
            </div>
            <div>
              <span className={styles.badge}>Kommer snart</span>
              <h3>Egen side på kortet</h3>
              <p>Meny, åpningstider og hemmelige tilbud som dere endrer selv, bak ett tapp.</p>
            </div>
          </div>
        </section>

        {/* ── Produkter ── */}
        <section id="produkter" className={`${styles.section} ${styles.tinted}`}>
          <div className={styles.inner}>
            <h2>Produktene</h2>
            <p className={styles.sectionLede}>To formater. Velg det som passer stedet dere jobber i.</p>
            <div className={styles.products}>
              <article>
                <div className={styles.productImg}>
                  <Image src="/assets/product-sticker.webp" alt="TapZon Sticker" width={580} height={700} sizes="(max-width: 700px) 60vw, 280px" />
                </div>
                <h3>TapZon Sticker</h3>
                <p className={styles.spec}>10,5 × 7 cm</p>
                <p>Står lent mot disk eller dør, eller limes flatt med kraftig 3M-tape på baksiden.</p>
              </article>
              <article>
                <div className={styles.productImg}>
                  <Image src="/assets/product-stand.webp" alt="TapZon Stand" width={456} height={700} sizes="(max-width: 700px) 60vw, 280px" />
                </div>
                <h3>TapZon Stand</h3>
                <p className={styles.spec}>Bordstativ</p>
                <p>Kortet i et hvitt stativ. Passer på restaurantbord, i resepsjonen eller på venterommet.</p>
              </article>
            </div>
            <div className={styles.prices}>
              <div><b>1 stk</b><span>500 kr</span></div>
              <div><b>2 stk</b><span>800 kr</span></div>
              <div><b>3 stk</b><span>1 000 kr</span></div>
            </div>
            <p className={styles.small}>Samme pris for Sticker og Stand. Trenger dere flere, ta kontakt for et tilbud.</p>
          </div>
        </section>

        {/* ── Hvem ── */}
        <section className={styles.section}>
          <div className={styles.inner}>
            <h2>Hvem er det for</h2>
            <ul className={styles.audience}>
              {AUDIENCE.map((a) => <li key={a}>{a}</li>)}
            </ul>
            <div className={styles.photoRow}>
              <Image src="/assets/photo-sticker.webp" alt="TapZon-kort i en hotellresepsjon" width={1200} height={961} sizes="(max-width: 860px) 100vw, 1000px" />
            </div>
          </div>
        </section>

        {/* ── Kontakt ── */}
        <section id="kontakt" className={`${styles.section} ${styles.contact}`}>
          <div className={styles.inner}>
            <h2>Klar for å prøve TapZon?</h2>
            <p className={styles.sectionLede}>
              Fortell oss om bedriften og hva dere vil at kundene skal havne på, så sender vi et tilbud.
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
          <div className={styles.brand}>
            <Image src="/assets/tapzon-mark.png" alt="" width={30} height={18} />
            <span>TapZon</span>
          </div>
          <span>Tap. Review. Grow.</span>
          <Link href="/admin">Logg inn som butikkeier</Link>
        </div>
      </footer>
    </div>
  );
}
