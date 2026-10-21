/** All tekst på den offentlige nettsiden. Redigeres på /superadmin/nettside. */
export type TitleText = { title: string; text: string };
export type Offer = { tag: string; title: string; text: string; points: string[]; soon: boolean };
export type PriceItem = { label: string; price: string };

export type SiteContent = {
  hero: { eyebrow: string; title: string; lede: string; primaryCta: string; secondaryCta: string };
  goals: { title: string; items: TitleText[]; button: string };
  ideas: { eyebrow: string; title: string; paragraphs: string[] };
  steps: { title: string; items: TitleText[] };
  services: { eyebrow: string; title: string; lede: string; offers: Offer[] };
  prices: { title: string; lede: string; items: PriceItem[]; note: string };
  contact: { title: string; lede: string; email: string; phone: string };
  footer: { tagline: string };
};

export const DEFAULT_SITE_CONTENT: SiteContent = {
  hero: {
    eyebrow: "Teknologi og markedsføring for lokale bedrifter",
    title: "Vi hjelper bedrifter å bli sett, valgt og husket.",
    lede: "TapZon hjelper dere med det dere ønsker å få til, enten det er flere anmeldelser, flere følgere eller flere kunder som kommer tilbake. Dere styrer innholdet selv, og vi er med hele veien.",
    primaryCta: "Ta kontakt",
    secondaryCta: "Se tjenestene",
  },
  goals: {
    title: "Hva vi hjelper med",
    items: [
      { title: "Bli funnet", text: "Flere anmeldelser på Google og flere følgere på Instagram, Facebook og TikTok, rett fra disken." },
      { title: "Få kunder inn døra", text: "Løsninger som gjør butikken mer synlig og gir folk en grunn til å stikke innom." },
      { title: "Få dem tilbake", text: "Digitale klippekort, tilbud og opplevelser som gjør at kundene kommer igjen." },
    ],
    button: "Se alle tjenestene",
  },
  ideas: {
    eyebrow: "Nye ideer, sammen",
    title: "Vi finner på løsningene sammen med dere",
    paragraphs: [
      "Ingen butikker er like. Derfor starter vi med det dere ønsker: Hva skal til for at flere kunder finner veien inn? Hva får dem til å komme tilbake?",
      "Sammen kommer vi på nye måter å bruke teknologi og markedsføring på i akkurat deres bedrift. Noen ganger er det et TapZon-kort ved kassen. Andre ganger er det noe helt nytt som vi utvikler for dere.",
      "Og når løsningen er på plass, styrer dere den selv. Dere logger inn og endrer innholdet når dere vil, uten å kunne kode.",
    ],
  },
  steps: {
    title: "Slik jobber vi",
    items: [
      { title: "Vi tar en prat", text: "Dere forteller hva dere ønsker å oppnå, og vi kommer med forslag." },
      { title: "Vi setter det opp", text: "Vi leverer TapZon-kortene ferdig programmert og gjør løsningen klar for dere." },
      { title: "Dere styrer, vi hjelper", text: "Dere oppdaterer innholdet selv. Trenger dere hjelp eller nye ideer, er vi en telefon unna." },
    ],
  },
  services: {
    eyebrow: "Tjenester",
    title: "Dette kan vi hjelpe dere med",
    lede: "Velg det som passer, eller fortell oss hva dere ønsker, så finner vi en løsning sammen. Vi lager stadig nye tjenester.",
    offers: [
      {
        tag: "Synlighet",
        title: "Flere anmeldelser og følgere",
        text: "TapZon-kort som sender kunden rett dit dere vil, med ett tapp på telefonen.",
        points: ["Google-anmeldelser", "Instagram, Facebook og TikTok", "Tripadvisor, meny eller egen nettside"],
        soon: false,
      },
      {
        tag: "Plattform",
        title: "TapZon-kort dere styrer selv",
        text: "Hvert kort har sin egen side. Dere logger inn og endrer innholdet når dere vil, uten å bytte kortet.",
        points: ["Endre tekst og bilder fra mobilen", "Endringer vises med en gang", "Ett kort, én side"],
        soon: false,
      },
      {
        tag: "For klesbutikker",
        title: "TapZon Style",
        text: "Et kort ved hvert plagg. Kunden tapper og får stylingforslag og farger som passer til akkurat det plagget.",
        points: ["Bilder av ferdige antrekk", "Farger som passer til", "Butikken oppdaterer selv"],
        soon: false,
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
        soon: false,
      },
    ],
  },
  prices: {
    title: "TapZon-kort",
    lede: "Kortene finnes som sticker (10,5 × 7 cm, står eller limes fast) og i bordstativ. Samme pris for begge.",
    items: [
      { label: "1 kort", price: "500 kr" },
      { label: "2 kort", price: "800 kr" },
      { label: "3 kort", price: "1 000 kr" },
    ],
    note: "Flere kort, TapZon Style eller andre løsninger? Ta kontakt, så lager vi et tilbud som passer dere.",
  },
  contact: {
    title: "La oss snakke sammen",
    lede: "Fortell oss litt om bedriften og hva dere ønsker, så finner vi ut hva som gir dere mest.",
    email: "tapzonreview@gmail.com",
    phone: "+47 941 09 011",
  },
  footer: { tagline: "Teknologi og markedsføring for lokale bedrifter" },
};

/**
 * Gjør innhold fra skjemaet om til gyldig SiteContent: følger formen til standardinnholdet,
 * kutter for lange tekster og fyller inn det som mangler.
 */
export function normalizeContent(input: unknown): SiteContent {
  return normalize(input, DEFAULT_SITE_CONTENT) as SiteContent;
}

function normalize(value: unknown, template: unknown): unknown {
  if (typeof template === "string") return typeof value === "string" ? value.trim().slice(0, 2000) : template;
  if (typeof template === "boolean") return typeof value === "boolean" ? value : template;
  if (Array.isArray(template)) {
    if (!Array.isArray(value)) return template;
    return value.slice(0, 30).map((v) => normalize(v, template[0]));
  }
  if (template && typeof template === "object") {
    const src = value && typeof value === "object" ? (value as Record<string, unknown>) : {};
    return Object.fromEntries(
      Object.entries(template as Record<string, unknown>).map(([k, t]) => [k, normalize(src[k], t)]),
    );
  }
  return template;
}
