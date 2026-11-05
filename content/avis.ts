// ============================================================================
// ⚠️ AVIS À REMPLACER : aucun avis client n'a été fourni dans le brief.
// On n'invente pas de témoignages. Ces trois entrées sont des emplacements :
// copier les vrais avis (Google, Instagram, Facebook) avec l'accord des clientes.
// Tant que `placeholder` vaut true, la carte affiche un texte explicite de remplacement.
// ============================================================================
export type Avis = {
  id: string;
  author: string;
  event: string;
  quote: string;
  rating: 1 | 2 | 3 | 4 | 5;
  placeholder: boolean;
};

export const avis: Avis[] = [
  { id: "a1", author: "Prénom N.", event: "Anniversaire", quote: "Avis client à intégrer — à reprendre depuis Google ou Instagram.", rating: 5, placeholder: true },
  { id: "a2", author: "Prénom N.", event: "Baptême", quote: "Avis client à intégrer — à reprendre depuis Google ou Instagram.", rating: 5, placeholder: true },
  { id: "a3", author: "Prénom N.", event: "Entreprise", quote: "Avis client à intégrer — à reprendre depuis Google ou Instagram.", rating: 5, placeholder: true },
];

/** Clients entreprise cités dans le brief (affichés en texte : aucun fichier logo fourni). */
export const clientLogos = [
  "CSE OTAG — SFR",
  "Groupama Antilles-Guyane",
  "Carrefour Market",
  "UDSON Group",
  "CANBT",
];
