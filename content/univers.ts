import { photo } from "./site";
import type { UniversId } from "./types";

// ⚠️ PRIX NON VALIDÉS PAR LA CLIENTE — repris du palier Essentiel de content/formules.ts.
export type Univers = {
  id: UniversId;
  title: string;
  pitch: string;
  priceFrom: number;
  src: string;
  alt: string;
  href: string;
};

export const univers: Univers[] = [
  {
    id: "anniversaire",
    title: "Anniversaires",
    pitch: "Enfants comme adultes, une fête à votre image.",
    priceFrom: 590,
    src: photo("anniversaire-thamura-min-400x516.jpg"),
    alt: "Décoration d'anniversaire réalisée par Audrey.L Company en Guadeloupe",
    href: "/formules#anniversaire-enfant",
  },
  {
    id: "bapteme",
    title: "Baptêmes & bébé",
    pitch: "Baptême, baby shower, gender reveal : la douceur en détail.",
    priceFrom: 590,
    src: photo("bapteme-yloann-3-min-400x516.jpg"),
    alt: "Décoration du baptême d'Yloann par Audrey.L Company en Guadeloupe",
    href: "/formules#bapteme",
  },
  {
    id: "mariage",
    title: "Mariages",
    pitch: "Votre mariage aux Antilles, de la scénographie au jour J.",
    priceFrom: 2500,
    src: photo("mariage-s-et-t-min-400x516.jpg"),
    alt: "Décoration du mariage de S. et T. par Audrey.L Company en Guadeloupe",
    href: "/formules#mariage",
  },
  {
    id: "entreprise",
    title: "Entreprises",
    pitch: "Arbres de Noël, CSE, séminaires et inaugurations.",
    priceFrom: 990,
    src: photo("arbre-de-noel-min-400x516.jpg"),
    alt: "Décoration d'arbre de Noël d'entreprise par Audrey.L Company en Guadeloupe",
    href: "/formules#entreprise",
  },
];
