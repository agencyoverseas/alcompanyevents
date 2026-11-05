// « Comment ça se passe ? » — textes fournis par la cliente (repris mot pour mot).
export type Step = { n: string; title: string; text: string };

export const PROCESS_TITLE = "4 étapes et vous n'avez plus rien à gérer.";

export const process: Step[] = [
  {
    n: "01",
    title: "On discute",
    text: "Vous nous parlez de votre projet en remplissant notre formulaire de demande de devis. Date, lieu, nombre d'invités, ambiance, envies et budget : nous apprenons à connaître votre projet.",
  },
  {
    n: "02",
    title: "On imagine",
    text: "Vous recevez une planche d'inspiration qui vous plonge dans l'univers imaginé pour votre événement, accompagnée de votre proposition et de votre devis détaillé.",
  },
  {
    n: "03",
    title: "On valide",
    text: "La réservation est confirmée par le versement d'un acompte de 50 %. Nous affinons ensuite chaque détail avec vous : couleurs, matières, décoration, menus et différents éléments de votre événement. Selon la formule choisie, nous nous chargeons également du matériel et de la coordination avec les différents prestataires.",
  },
  {
    n: "04",
    title: "On installe, vous profitez",
    text: "Le jour J, notre équipe prend possession des lieux et installe votre décoration. Lorsque la coordination est incluse dans votre formule, nous veillons également au bon déroulement de l'événement. Vous n'avez plus qu'à profiter de votre moment. À la fin de l'événement, notre équipe se charge du démontage.",
  },
];
