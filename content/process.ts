// Déroulé en quatre étapes — formulation à faire relire par la cliente.
export type Step = { n: string; title: string; text: string };

export const process: Step[] = [
  { n: "01", title: "On fait connaissance", text: "Un premier échange pour cerner l'événement, vos envies, le lieu, le nombre d'invités et le budget." },
  { n: "02", title: "On imagine", text: "Proposition sur mesure, planche d'inspiration, couleurs et matières : vous validez avant qu'on lance quoi que ce soit." },
  { n: "03", title: "On prépare", text: "Réservation avec un acompte de 50 %, puis préparation du matériel et coordination des prestataires si besoin." },
  { n: "04", title: "On installe, vous profitez", text: "Installation sur place, présence le jour J selon la formule, et démontage après la fête." },
];
