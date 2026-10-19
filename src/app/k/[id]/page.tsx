import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createPublicClient } from "@/lib/supabase/public";
import { imageUrl } from "@/lib/env";
import type { PublicCard } from "@/lib/types";
import { StyleCardView } from "@/components/StyleCardView";
import { CardNotice } from "@/components/CardNotice";

// Alltid ferskt innhold: når butikken lagrer, ser neste kunde endringen med en gang.
export const dynamic = "force-dynamic";

async function loadCard(id: string): Promise<PublicCard | null> {
  if (!/^[A-Za-z0-9]{6,16}$/.test(id)) return null;
  const supabase = createPublicClient();
  const { data, error } = await supabase.rpc("get_public_card", { p_id: id });
  if (error) throw error;
  return (data as PublicCard | null) ?? null;
}

export async function generateMetadata(props: PageProps<"/k/[id]">): Promise<Metadata> {
  const { id } = await props.params;
  const card = await loadCard(id);
  if (!card || card.status !== "active") return { title: "TapZon", robots: { index: false } };
  return { title: `${card.title} · ${card.business.name}`, robots: { index: false } };
}

export default async function CardPage(props: PageProps<"/k/[id]">) {
  const { id } = await props.params;
  const card = await loadCard(id);

  if (!card) notFound();
  if (card.status === "inactive") {
    return <CardNotice title="Dette kortet er ikke i bruk nå" text="Spør gjerne en ansatt i butikken." />;
  }
  if (card.module_type !== "style") {
    return <CardNotice title={card.business.name} text="Innholdet til dette kortet kommer snart." />;
  }

  return (
    <StyleCardView
      storeName={card.business.name}
      logoUrl={imageUrl(card.business.logo_path)}
      accentColor={card.business.accent_color}
      title={card.title}
      looks={card.looks.map((l) => ({ imageUrl: imageUrl(l.image_path), caption: l.caption, colors: l.colors }))}
    />
  );
}
