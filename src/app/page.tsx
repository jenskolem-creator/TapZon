import Link from "next/link";

export default function Home() {
  return (
    <main className="wrap narrow" style={{ paddingTop: 80 }}>
      <div className="brand">TapZon</div>
      <h1 style={{ margin: "12px 0 10px" }}>Tapp et kort, få innholdet som hører til</h1>
      <p className="hint" style={{ marginBottom: 24 }}>
        NFC-kort for butikker, kaféer og frisører. Hvert kort viser sitt eget innhold, og butikken endrer det selv.
      </p>
      <Link className="btn" href="/admin">Logg inn for butikker</Link>
    </main>
  );
}
