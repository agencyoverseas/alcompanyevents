export type UniversId = "mariage" | "bapteme" | "anniversaire" | "entreprise" | "scenographie";

export type Realisation = {
  id: string;
  title: string;
  /** ⚠️ Commune de l'événement : non fournie dans le brief. null = non affichée. À compléter (SEO local). */
  commune: string | null;
  univers: UniversId;
  src: string;
  alt: string;
};

export type Tier = "essentiel" | "signature" | "prestige";

/** Un prix « à partir de » en euros, ou null pour « sur devis ». */
export type Price = number | null;
