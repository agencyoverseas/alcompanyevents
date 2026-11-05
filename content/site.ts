// Coordonnées et identité. Source : brief client.
export const site = {
  name: "Audrey.L Company",
  url: "https://alcompanyevents.fr",
  founded: "2023-07",
  phone: "+590690767680",
  phoneDisplay: "0690 76 76 80",
  whatsapp: "https://wa.me/590690767680",
  // ⚠️ À VALIDER PAR LA CLIENTE — email non confirmé. Laisser null tant qu'il n'est pas validé :
  // aucun lien mailto n'est affiché tant que la valeur est null.
  email: null as string | null,
  // ⚠️ À VALIDER PAR LA CLIENTE — nombre d'événements réalisés. Non affiché tant que null.
  eventsCount: null as number | null,
  areaServed: ["Guadeloupe", "Marie-Galante", "Les Saintes", "La Désirade", "Saint-Martin"],
  credentials: ["Designer événementiel certifiée", "Maîtrise de l'art de la table"],
  description:
    "Décoration et organisation d'événements clé en main en Guadeloupe et dans les îles alentours : anniversaires, baptêmes, mariages, événements d'entreprise.",
} as const;

export const telHref = `tel:${site.phone}`;

/** URL des photos servies par le WordPress actuel (400×516). */
export const PHOTO_BASE = "https://alcompanyevents.fr/wp-content/uploads/2024/09/";
export const photo = (file: string) => `${PHOTO_BASE}${file}`;
export const PHOTO_W = 400;
export const PHOTO_H = 516;
