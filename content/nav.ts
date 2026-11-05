export const NAV_LINKS = [
  { href: "/", label: "Accueil" },
  { href: "/formules", label: "Formules" },
  { href: "/prestations", label: "Prestations" },
  { href: "/realisations", label: "Réalisations" },
  { href: "/comment-ca-se-passe", label: "Comment ça se passe" },
  { href: "/a-propos", label: "À propos" },
  { href: "/faq", label: "FAQ" },
  { href: "/journal", label: "Journal" },
] as const;

/** Libellés d'appel à l'action demandés par la cliente. */
export const CTA = {
  main: "Parlons de votre projet",
  devis: "Je demande mon devis",
  href: "/devis",
} as const;
