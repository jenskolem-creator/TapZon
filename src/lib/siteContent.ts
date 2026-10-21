import "server-only";
import { createPublicClient } from "@/lib/supabase/public";
import { DEFAULT_SITE_CONTENT, type SiteContent } from "@/lib/siteContentTypes";

/**
 * Henter teksten til nettsiden fra databasen. Mangler noe (eller tabellen finnes ikke ennå),
 * brukes standardteksten, så siden aldri blir tom.
 */
export async function getSiteContent(): Promise<SiteContent> {
  try {
    const { data, error } = await createPublicClient()
      .from("site_content")
      .select("data")
      .eq("id", "main")
      .maybeSingle();
    if (error || !data?.data) return DEFAULT_SITE_CONTENT;
    return mergeContent(data.data as Partial<SiteContent>);
  } catch {
    return DEFAULT_SITE_CONTENT;
  }
}

export function mergeContent(saved: Partial<SiteContent>): SiteContent {
  const out = { ...DEFAULT_SITE_CONTENT } as Record<string, unknown>;
  for (const key of Object.keys(DEFAULT_SITE_CONTENT) as (keyof SiteContent)[]) {
    const value = saved[key];
    if (value && typeof value === "object" && !Array.isArray(value)) {
      out[key] = { ...DEFAULT_SITE_CONTENT[key], ...value };
    }
  }
  return out as SiteContent;
}
