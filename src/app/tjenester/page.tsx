import type { Metadata } from "next";
import { ContactSection, SiteFooter, SiteHeader } from "@/components/site/SiteChrome";
import styles from "../home.module.css";

export const metadata: Metadata = {
  title: "Tjenester · TapZon",
  description: "TapZon-kort, anmeldelser, følgere, klippekort og løsninger som bedriften styrer selv.",
};

type Offer = { tag: string; title: string; text: string; points: string[]; soon?: boolean };

const OFFERS: Offer[] = [
  {
    tag: "Synlighet",
    title: "Flere anmeldelser og følgere",
    text: "TapZon-kort som sender kunden rett dit dere vil, med ett tapp på telefonen.",
    points: ["Google-anmeldelser", "Instagram, Facebook og TikTok", "Tripadvisor, meny eller egen nettside"],
  },
  {
    tag: "Plattform",
    title: "TapZon-kort dere styrer selv",
    text: "Hvert kort har sin egen side. Dere logger inn og endrer innholdet når dere vil, uten å bytte kortet.",
    points: ["Endre tekst og bilder fra mobilen", "Endringer vises med en gang", "Ett kort, én side"],
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
    points: ["Ingen papirkort å miste", "Kunden huskes automatisk", "Belønning når kortet er fullt"],
    soon: true,
  },
  {
    tag: "Innhold",
    title: "Egen side bak kortet",
    text: "Meny, åpningstider og hemmelige tilbud som bare vises for dem som tapper kortet.",
    points: ["Dere skriver innholdet selv", "Passer for kaféer og frisører", "Bytt tilbud så ofte dere vil"],
    soon: true,
  },
  {
    tag: "Sammen",
    title: "Noe helt eget",
    text: "Har dere en idé, eller vil dere ha hjelp til å finne en? Vi utvikler nye løsninger sammen med dere.",
    points: ["Uforpliktende prat", "Vi foreslår en løsning", "Vi bygger den for dere"],
  },
];

export default function ServicesPage() {
  return (
    <div className={styles.site}>
      <SiteHeader />

      <main>
        <section className={styles.pageHero}>
          <div className={styles.inner}>
            <p className={styles.eyebrow}>Tjenester</p>
            <h1>Dette kan vi hjelpe dere med</h1>
            <p className={styles.lede}>
              Velg det som passer, eller fortell oss hva dere ønsker, så finner vi en løsning sammen.
              Vi lager stadig nye tjenester.
            </p>
          </div>
        </section>

        <section className={`${styles.section} ${styles.tinted}`}>
          <div className={styles.inner}>
            <div className={styles.offers} style={{ marginTop: 0 }}>
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

        <ContactSection />
      </main>

      <SiteFooter />
    </div>
  );
}
