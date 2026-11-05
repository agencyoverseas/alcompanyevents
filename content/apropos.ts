import { site } from "./site";

// Faits validés uniquement (brief).
export const about = {
  founded: "juillet 2023",
  credentials: site.credentials,
  islands: site.areaServed.length,
  promise:
    "Nous ne proposons pas uniquement de la décoration : nous concevons une expérience événementielle complète et personnalisée, de la scénographie jusqu'à l'organisation et à la coordination, selon vos besoins.",
};

// ⚠️ TEXTE NON VALIDÉ (issu de la maquette) — NON AFFICHÉ tant que la cliente ne l'a pas relu :
// « En janvier 2020, après avoir orchestré de A à Z le mariage de ma cousine, j'ai compris que
// je pouvais en faire mon métier… » → à confirmer, puis à placer dans `story` ci-dessous.
export const story: string[] = [];
