/** Catégories de la galerie (liste de la cliente + mariage, conservé). */
export type UniversId = "anniversaire" | "bapteme" | "professionnel" | "scenographie" | "cle-en-main" | "mariage";

export type Realisation = {
  id: string;
  title: string;
  /** ⚠️ Commune de l'événement : non fournie dans le brief. null = non affichée. À compléter (SEO local). */
  commune: string | null;
  univers: UniversId;
  src: string;
  alt: string;
  /** Vidéo de la réalisation (MP4 court et compressé). Aucune fournie pour l'instant. */
  video?: { src: string; poster: string };
};

export type Tier = "essentiel" | "signature" | "prestige";

/** Un prix « à partir de » en euros, ou null pour « sur devis ». */
export type Price = number | null;
