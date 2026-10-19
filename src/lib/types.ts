export type ModuleType = "start" | "loyalty" | "style";

export const MODULE_NAMES: Record<ModuleType, string> = {
  style: "Style (klesbutikk)",
  start: "Start",
  loyalty: "Stempelkort",
};

export type StyleColor = { hex: string; label: string };

/** Ett stylingforslag slik det lagres. */
export type StyleLook = {
  image_path: string | null;
  caption: string;
  colors: StyleColor[];
};

/** Det get_public_card() i databasen returnerer for et aktivt kort. */
export type PublicCard =
  | { status: "inactive" }
  | {
      status: "active";
      id: string;
      module_type: ModuleType;
      title: string;
      business: { name: string; logo_path: string | null; accent_color: string | null };
      looks: StyleLook[];
    };

export const MAX_LOOKS = 2;
export const MAX_COLORS = 8;
