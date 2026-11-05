import { photo } from "./site";
import type { Price, Tier } from "./types";

// ============================================================================
// ⚠️ TOUS LES PRIX DE CE FICHIER SONT NON VALIDÉS PAR LA CLIENTE.
// Ils sont repris tels quels du brief. Tous sont des prix « à partir de ».
// ============================================================================

export const ACOMPTE_PERCENT = 50;

export type TierInfo = {
  id: Tier;
  name: string;
  tagline: string;
  /** Prestations propres à ce palier (en plus du palier précédent). */
  includes: string[];
  inherits?: Tier;
  popular?: boolean;
};

export const tiers: TierInfo[] = [
  {
    id: "essentiel",
    name: "Essentiel",
    tagline: "La décoration posée, sans vous en soucier.",
    includes: [
      "Rendez-vous de cadrage",
      "Décoration et matériel",
      "Installation sur place",
      "Désinstallation après la fête",
    ],
  },
  {
    id: "signature",
    name: "Signature",
    tagline: "Une scénographie pensée pour vous seul·e.",
    inherits: "essentiel",
    popular: true,
    includes: [
      "Scénographie sur mesure",
      "Planche d'inspiration dédiée",
      "Sélection des couleurs et matières",
    ],
  },
  {
    id: "prestige",
    name: "Prestige",
    tagline: "Vous recevez, on s'occupe de tout le reste.",
    inherits: "signature",
    includes: [
      "Organisation complète de A à Z",
      "Coordination des prestataires",
      "Présence et gestion le jour J",
    ],
  },
];

export type FamilyId = "anniversaire-enfant" | "anniversaire-adulte" | "bapteme" | "entreprise";

export type Family = {
  id: FamilyId;
  name: string;
  short: string;
  /** Valeur envoyée au formulaire de devis. */
  eventType: string;
  prices: Record<Tier, Price>;
  photo: string;
  alt: string;
  tag?: string;
};

export const families: Family[] = [
  { id: "anniversaire-enfant", name: "Anniversaire enfant", short: "Thèmes, ballons, sweet table : la fête dont ils se souviendront.", eventType: "Anniversaire enfant", prices: { essentiel: 590, signature: 890, prestige: 1490 }, photo: photo("anniversaire-thamura-min-400x516.jpg"), alt: "Décoration d'anniversaire enfant en Guadeloupe" },
  { id: "anniversaire-adulte", name: "Anniversaire adulte", short: "30, 40, 50 ans et plus : une soirée à la hauteur du cap.", eventType: "Anniversaire adulte", prices: { essentiel: 690, signature: 1190, prestige: 1890 }, photo: photo("anniversaire-Joyce-min-400x516.jpg"), alt: "Décoration d'anniversaire adulte en Guadeloupe" },
  { id: "bapteme", name: "Baptême & autour de bébé", short: "Baptême, baby shower, gender reveal.", eventType: "Baptême / autour de bébé", prices: { essentiel: 590, signature: 990, prestige: 1590 }, photo: photo("bapteme-yloann-3-min-400x516.jpg"), alt: "Décoration de baptême en Guadeloupe" },
  { id: "entreprise", name: "Entreprise", short: "CSE, arbres de Noël, séminaires, inaugurations.", eventType: "Entreprise", prices: { essentiel: 990, signature: 1790, prestige: null }, photo: photo("arbre-de-noel-min-400x516.jpg"), alt: "Arbre de Noël d'entreprise décoré en Guadeloupe", tag: "Pro" },
];

/** Prix le plus bas affiché sur le site (pour l'accroche « à partir de »). */
export const lowestPrice = Math.min(
  ...families.flatMap((f) => Object.values(f.prices).filter((p): p is number => p !== null)),
);

export type Option = { id: string; name: string; price: Price; note?: string };

/**
 * Bars personnalisés & animations gourmandes. Avec ou sans service.
 * Prestations complémentaires : ne peuvent pas être réservées seules.
 * ⚠️ Prix du bar à gaufres / pancakes non communiqué → « sur demande ».
 * ⚠️ Photos de chaque bar à fournir par la cliente.
 */
export const complements: (Option & { text: string; photo?: string })[] = [
  { id: "gaufres-pancakes", name: "Bar à gaufres / pancakes", price: null, text: "Gaufres et pancakes préparés sur place, garnitures au choix." },
  { id: "popcorn", name: "Bar à pop-corn", price: 190, text: "Pop-corn sucré ou salé, présenté dans un décor assorti à votre thème." },
  { id: "barbe-a-papa", name: "Bar à barbe à papa", price: 220, text: "La gourmandise préférée des enfants… et des grands." },
  { id: "sweet-table", name: "Sweet table", price: 290, text: "Une table de douceurs mise en scène aux couleurs de votre événement." },
];

export const COMPLEMENT_NOTE =
  "Proposés avec ou sans service. Prestations complémentaires : elles ne peuvent pas être réservées seules.";

/** Services complémentaires : jamais seuls. */
export const SERVICES_NOTE =
  "Ces services sont proposés en complément de nos prestations événementielles et ne peuvent pas être réservés seuls auprès d'AUDREY.L COMPANY.";

export const services: Option[] = [
  { id: "hotesses", name: "Hôtesses d'accueil", price: 180 },
  { id: "traiteur", name: "Service traiteur", price: null },
  { id: "animation-enfant", name: "Animation enfant", price: 350 },
  { id: "dj", name: "DJ et animation musicale", price: 450 },
];

/** Mini-concepts : prix fixes (pas « à partir de »). */
export const miniConcepts: Option[] = [
  { id: "solo-date", name: "Solo date", price: 290, note: "Prix fixe" },
  { id: "pyjama-party", name: "Pyjama party", price: 340, note: "Prix fixe" },
  { id: "demande-speciale", name: "Demande spéciale", price: null },
];

export const mariage = {
  priceFrom: 2500,
  eventType: "Mariage",
  pitch:
    "Chaque mariage est unique : pas de paliers, une proposition construite avec vous après un premier rendez-vous.",
};

/** Lignes du tableau comparatif (dans l'ordre d'affichage). */
export const compareRows: { label: string; tiers: Tier[] }[] = [
  ...tiers.flatMap((t) =>
    t.includes.map((label) => ({
      label,
      tiers: tiers.slice(tiers.findIndex((x) => x.id === t.id)).map((x) => x.id),
    })),
  ),
];

export const formatPrice = (p: Price, onRequest = "Sur devis") =>
  p === null ? onRequest : `${new Intl.NumberFormat("fr-FR").format(p).replace(/ | /g, " ")} €`;
