// ============================================================================
// « Ils parlent de leur expérience »
// ⚠️ AVIS À FOURNIR par la cliente : prénom, type d'événement, texte, et si
// possible une photo de la réalisation correspondante. Aucun avis inventé.
// Tant que la liste est vide, la section affiche un emplacement neutre.
// ============================================================================
export type Avis = {
  id: string;
  prenom: string;
  event: string;
  quote: string;
  rating?: 1 | 2 | 3 | 4 | 5;
  /** Photo de la réalisation (URL absolue ou /public). */
  photo?: string;
  photoAlt?: string;
};

export const avis: Avis[] = [];

/** Clients professionnels (libellés exacts de la cliente).
 *  ⚠️ Fichiers logo à fournir, avec l'accord de chaque entreprise. */
export const clientLogos: { name: string; logo?: string }[] = [
  { name: "CSE OTAG – Comité d'entreprise SFR" },
  { name: "Groupama Antilles-Guyane" },
  { name: "Carrefour Market" },
  { name: "UDSON Group" },
  { name: "CANBT" },
];
