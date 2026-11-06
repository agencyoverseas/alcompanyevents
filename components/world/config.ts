// Monde 3D de l'accueil (bureau) : trajectoire unique, pilotée par le scroll.
// P va de 0 à 4 : chaque intermède du DOM fait avancer P d'une unité.
// Clés à P = 0, 0.5, 1, … 4 (0.5 = plan principal de l'intermède, plein écran).

type V3 = readonly [number, number, number];

export const KEYS: { cam: V3; look: V3; audrey: V3 }[] = [
  // 0 · Envol : on lève les yeux, Audrey monte sur son nuage.
  { cam: [0, -1, 9], look: [0, 3, 0], audrey: [0.9, -4.2, 1] },
  { cam: [0, 2.2, 7.6], look: [0, 2.6, 0], audrey: [1.15, 1.25, 1.6] },
  // 1 · Quatre univers : îles de nuages et arches de ballons.
  { cam: [1.2, 6.4, 6.2], look: [3, 8.4, -4], audrey: [2.6, 6.6, -1.5] },
  { cam: [6, 10.6, -0.4], look: [6, 9.6, -11], audrey: [6.25, 8.95, -5.8] },
  // 2 · Le déroulé : quatre balises numérotées sur un chemin de nuages.
  {
    cam: [11, 12, -4.6],
    look: [16.5, 11, -16],
    audrey: [12.4, 10.1, -10.5],
  },
  {
    cam: [18.2, 12.5, -7.2],
    look: [18.6, 10.9, -18.5],
    audrey: [17.6, 10.55, -16.4],
  },
  // 3 · Arrivée sous la grande arche, face à la visiteuse.
  {
    cam: [21.5, 13.3, -17.5],
    look: [24, 13.4, -34],
    audrey: [23.3, 11.4, -22.8],
  },
  {
    cam: [24, 14.15, -28.6],
    look: [24, 13.95, -36],
    audrey: [24, 12.95, -34.9],
  },
  { cam: [24, 14.3, -31.2], look: [24, 14.25, -36], audrey: [24, 12.95, -35] },
];

/** Poids « regarde la visiteuse » (0 = regarde où elle va) au centre de chaque intermède. */
export const ATTENTION = [0.85, 0.35, 0.2, 1];

export const AUDREY = {
  /** Hauteur à l'écran (unités monde) ; l'atlas fait 5 vues de 304×1024. */
  height: 1.75,
  aspect: 304 / 1024,
  frames: 5,
  /** Petit flottement sur son nuage. */
  bob: { amp: 0.05, freq: 1.3 },
  /** Retournement « papier » quand la vue change (s). */
  flip: 0.18,
};

// Palette des ballons (échantillonnée sur la mascotte, comme le héro).
export const BALLOON = {
  terracotta: "#B45A3C",
  ciel: "#7896B4",
  creme: "#E6DCC4",
  sable: "#D2B496",
  bleu: "#2C6A94",
} as const;
type Tone = keyof typeof BALLOON;

/** Quatre îles (formules) : position du centre et couleurs de l'arche. */
export const ISLANDS: { at: V3; tones: Tone[] }[] = [
  { at: [1.2, 8.2, -11], tones: ["ciel", "terracotta", "creme"] }, // anniversaire enfant
  { at: [4.7, 8.6, -12.6], tones: ["terracotta", "sable"] }, // anniversaire adulte
  { at: [8.2, 8.3, -11.6], tones: ["ciel", "creme"] }, // baptême & bébé
  { at: [11.6, 8.8, -13], tones: ["bleu", "sable"] }, // entreprise
];

/** Balises du déroulé (01 → 04). */
export const MARKERS: V3[] = [
  [13.6, 10.1, -17.6],
  [16.9, 10.4, -18.6],
  [20.2, 10.7, -19.6],
  [23.5, 11, -20.6],
];

export const FINAL_ARCH = { at: [24, 12.95, -36] as V3, radius: 2.1 };
