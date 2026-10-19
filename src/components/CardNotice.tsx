/** Enkel melding på kortsiden når det ikke finnes innhold å vise. */
export function CardNotice({ title, text }: { title: string; text: string }) {
  return (
    <main className="wrap narrow" style={{ paddingTop: 80, textAlign: "center" }}>
      <div className="brand">TapZon</div>
      <h1 style={{ marginTop: 14 }}>{title}</h1>
      <p className="hint" style={{ marginInline: "auto" }}>{text}</p>
    </main>
  );
}
