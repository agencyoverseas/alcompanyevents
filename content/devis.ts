// Options du formulaire de devis.
export const eventTypes = [
  "Anniversaire enfant",
  "Anniversaire adulte",
  "Baptême / autour de bébé",
  "Mariage",
  "Entreprise",
  "Mini-concept",
  "Autre",
] as const;

export const budgets = [
  "Moins de 600 €",
  "600 à 1 000 €",
  "1 000 à 2 000 €",
  "2 000 à 5 000 €",
  "Plus de 5 000 €",
  "Je ne sais pas encore",
] as const;

export type DevisPayload = {
  nom: string;
  telephone: string;
  email: string;
  type: string;
  date: string | null;
  sansDate: boolean;
  invites?: string;
  budget?: string;
  lieu?: string;
  message?: string;
  formule?: string;
};

/** Lien vers le formulaire pré-rempli (depuis une formule). */
export const devisHref = (type: string, formule?: string) => {
  const q = new URLSearchParams({ type });
  if (formule) q.set("formule", formule);
  return `/?${q.toString()}#devis`;
};
