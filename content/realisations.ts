import { photo } from "./site";
import type { Realisation, UniversId } from "./types";

// ⚠️ COMMUNES À COMPLÉTER : le brief demande titre + commune pour le SEO local,
// mais aucune commune n'a été fournie. Tant que `commune` vaut null, on affiche « Guadeloupe ».
// ⚠️ Classement « arbre de Noël → professionnel » et « autre / prestations → scénographie » déduit
// des noms de fichiers : à confirmer. Aucune photo n'est encore classée « clé en main » :
// la catégorie s'affichera dès qu'une réalisation y sera rattachée.
// ⚠️ Photos en 400×516 : la cliente doit fournir des versions HD (et des vidéos).
export const realisations: Realisation[] = [
  { id: "mariage-st", title: "Mariage de S. & T.", commune: null, univers: "mariage", src: photo("mariage-s-et-t-min-400x516.jpg"), alt: "Table d'honneur décorée pour le mariage de S. et T., Audrey.L Company" },
  { id: "mariage-st-2", title: "Mariage de S. & T. — réception", commune: null, univers: "mariage", src: photo("mariage-s-et-t-2-min-400x516.jpg"), alt: "Décor de réception du mariage de S. et T. en Guadeloupe" },
  { id: "bapteme-yloann", title: "Baptême d'Yloann", commune: null, univers: "bapteme", src: photo("bapteme-yloann-3-min-400x516.jpg"), alt: "Décoration et arche de ballons pour le baptême d'Yloann en Guadeloupe" },
  { id: "bapteme-yloann-2", title: "Baptême d'Yloann — table", commune: null, univers: "bapteme", src: photo("bapteme-yloann-2-min-400x516.jpg"), alt: "Table décorée du baptême d'Yloann, Audrey.L Company" },
  { id: "bapteme-naillah", title: "Baptême de Naillah", commune: null, univers: "bapteme", src: photo("bapteme-naillah-min-400x516.jpg"), alt: "Décoration du baptême de Naillah en Guadeloupe" },
  { id: "anniv-thamura", title: "Anniversaire de Thamura", commune: null, univers: "anniversaire", src: photo("anniversaire-thamura-min-400x516.jpg"), alt: "Décor d'anniversaire de Thamura avec ballons et sweet table" },
  { id: "anniv-joyce", title: "Anniversaire de Joyce", commune: null, univers: "anniversaire", src: photo("anniversaire-Joyce-min-400x516.jpg"), alt: "Décoration de l'anniversaire de Joyce en Guadeloupe" },
  { id: "anniv-danae", title: "Anniversaire de Danae", commune: null, univers: "anniversaire", src: photo("anniversaire-Danae-min-400x516.jpg"), alt: "Décoration de l'anniversaire de Danae par Audrey.L Company" },
  { id: "noel-1", title: "Arbre de Noël d'entreprise", commune: null, univers: "professionnel", src: photo("arbre-de-noel-min-400x516.jpg"), alt: "Décoration d'arbre de Noël pour une entreprise en Guadeloupe" },
  { id: "noel-2", title: "Arbre de Noël — espace enfants", commune: null, univers: "professionnel", src: photo("arbre-de-noel-2-min-400x516.jpg"), alt: "Espace enfants décoré pour un arbre de Noël d'entreprise" },
  { id: "noel-3", title: "Arbre de Noël — scène", commune: null, univers: "professionnel", src: photo("arbre-de-noel-3-min-400x516.jpg"), alt: "Scène décorée pour un arbre de Noël de comité d'entreprise" },
  { id: "scenographie-1", title: "Scénographie sur mesure", commune: null, univers: "scenographie", src: photo("10-Nos-prestatation-arriere-plan-10-min-1-400x516.jpg"), alt: "Scénographie événementielle sur mesure par Audrey.L Company" },
  { id: "scenographie-2", title: "Décor d'ambiance", commune: null, univers: "scenographie", src: photo("autre-1-min-400x516.jpg"), alt: "Décor d'ambiance réalisé par Audrey.L Company en Guadeloupe" },
];

/** Sélection de l'accueil (rail horizontal) : 8 photos, univers variés. */
export const featuredRealisations = [
  "mariage-st", "bapteme-yloann", "anniv-thamura", "noel-1",
  "bapteme-naillah", "anniv-joyce", "mariage-st-2", "scenographie-1",
].map((id) => realisations.find((r) => r.id === id)!);

export const universLabels: Record<UniversId, string> = {
  anniversaire: "Anniversaires",
  bapteme: "Baptêmes / événements religieux",
  professionnel: "Événements professionnels",
  scenographie: "Scénographies / photocalls",
  "cle-en-main": "Événements clé en main",
  mariage: "Mariages",
};

/** Filtres : uniquement les catégories qui ont au moins une réalisation. */
export const universFilters: { id: "tout" | UniversId; label: string }[] = [
  { id: "tout", label: "Tout" },
  ...(Object.keys(universLabels) as UniversId[])
    .filter((id) => realisations.some((r) => r.univers === id))
    .map((id) => ({ id, label: universLabels[id] })),
];

export const placeLabel = (r: Realisation) => r.commune ?? "Guadeloupe";

export const contactPhoto = photo("contactez-nous-min-400x516.jpg");
