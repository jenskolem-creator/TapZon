import Link from "next/link";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { cardUrl, imageUrl } from "@/lib/env";
import { MODULE_NAMES, type ModuleType } from "@/lib/types";
import { AdminHeader } from "@/components/AdminHeader";
import { StyleEditor } from "./StyleEditor";

export const metadata = { title: "Rediger brikke · TapZon" };

type CardWithLooks = {
  id: string;
  business_id: string;
  label: string;
  title: string;
  module_type: ModuleType;
  businesses: { name: string; logo_path: string | null; accent_color: string | null };
  style_looks: {
    image_path: string | null;
    caption: string;
    sort_order: number;
    style_colors: { hex: string; label: string; sort_order: number }[];
  }[];
};

export default async function EditCardPage(props: PageProps<"/admin/kort/[id]">) {
  const { id } = await props.params;
  const { supabase, user } = await requireUser();

  const { data: card } = await supabase
    .from("cards")
    .select(
      "id, business_id, label, title, module_type, businesses(name, logo_path, accent_color), style_looks(image_path, caption, sort_order, style_colors(hex, label, sort_order))",
    )
    .eq("id", id)
    .maybeSingle<CardWithLooks>();
  if (!card) notFound();

  const looks = [...card.style_looks]
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((l) => ({
      image_path: l.image_path,
      caption: l.caption,
      colors: [...l.style_colors].sort((a, b) => a.sort_order - b.sort_order).map(({ hex, label }) => ({ hex, label })),
    }));

  return (
    <main className="wrap">
      <AdminHeader email={user.email} />
      <Link className="linkbtn" href="/admin">&larr; Alle brikker</Link>

      {card.module_type !== "style" ? (
        <div className="panel" style={{ marginTop: 18 }}>
          <h2>{MODULE_NAMES[card.module_type]}</h2>
          <p className="hint">Redigering for denne typen brikke kommer snart.</p>
        </div>
      ) : (
        <StyleEditor
          cardId={card.id}
          businessId={card.business_id}
          publicUrl={cardUrl(card.id)}
          store={{
            name: card.businesses.name,
            logoUrl: imageUrl(card.businesses.logo_path),
            accentColor: card.businesses.accent_color,
          }}
          initial={{
            label: card.label,
            title: card.title,
            looks: looks.length ? looks : [{ image_path: null, caption: "", colors: [] }],
          }}
        />
      )}
    </main>
  );
}
