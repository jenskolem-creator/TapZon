import styles from "./StyleCardView.module.css";
import type { StyleColor } from "@/lib/types";

export type StyleCardViewProps = {
  storeName: string;
  logoUrl: string | null;
  accentColor: string | null;
  title: string;
  looks: { imageUrl: string | null; caption: string; colors: StyleColor[] }[];
};

/** Kundesiden for ett plagg. Brukes både på /k/[id] og som forhåndsvisning i admin. */
export function StyleCardView({ storeName, logoUrl, accentColor, title, looks }: StyleCardViewProps) {
  const style = accentColor ? ({ "--store-accent": accentColor } as React.CSSProperties) : undefined;

  return (
    <div className={styles.page} style={style}>
      <header className={styles.store}>
        {logoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={logoUrl} alt={storeName} className={styles.logo} />
        ) : (
          <span>{storeName}</span>
        )}
      </header>

      <div className={styles.product}>
        <small>Slik kan du style</small>
        <h1>{title || "Plagget"}</h1>
      </div>

      {looks.map((look, i) => {
        const colors = look.colors.filter((c) => c.hex);
        return (
          <article key={i} className={styles.look}>
            {i > 0 && <div className={styles.sep} />}
            <div className={styles.image}>
              {look.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={look.imageUrl} alt={`Stylingforslag ${i + 1} for ${title}`} />
              ) : (
                <div className={styles.noImage}>Bilde kommer</div>
              )}
              {looks.length > 1 && <span className={styles.badge}>Forslag {i + 1}</span>}
            </div>
            {look.caption && <p className={styles.caption}>{look.caption}</p>}
            {colors.length > 0 && (
              <div>
                <small className={styles.pairsLabel}>Passer godt med</small>
                <ul className={styles.chips}>
                  {colors.map((c, ci) => (
                    <li key={ci} className={styles.chip}>
                      <i style={{ background: c.hex }} />
                      {c.label || c.hex}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </article>
        );
      })}

      <footer className={styles.foot}>Drevet av TapZon</footer>
    </div>
  );
}
