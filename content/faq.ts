// FAQ : uniquement des réponses tirées d'informations validées (brief + mail de la cliente).
// ⚠️ Questions de la maquette retirées faute de réponse validée : délais de réservation,
// frais de déplacement, moyens de paiement, solde. À compléter avec la cliente.
import { ACOMPTE_PERCENT, lowestPrice, formatPrice } from "./formules";
import { site } from "./site";

export const faq: { q: string; a: string }[] = [
  {
    q: "Quels types d'événements organisez-vous ?",
    a: "Anniversaires enfants et adultes, baptêmes et événements autour de bébé, mariages, événements professionnels (CSE, arbres de Noël, séminaires) et mini-concepts comme la solo date ou la pyjama party.",
  },
  {
    q: "Faites-vous uniquement de la décoration ?",
    a: "Non. Selon la formule choisie, nous allons de la décoration installée et démontée jusqu'à l'organisation complète de A à Z, avec la coordination des prestataires et notre présence le jour J.",
  },
  {
    q: "Comment se déroule l'organisation ?",
    a: "En quatre étapes : on discute de votre projet, on imagine votre univers avec une planche d'inspiration et un devis détaillé, on valide ensemble chaque détail, puis on installe pendant que vous profitez. Le démontage est inclus.",
  },
  {
    q: "Quels sont vos tarifs ?",
    a: `Nos formules démarrent à ${formatPrice(lowestPrice)}. Tous les prix sont « à partir de » : le devis final dépend du nombre d'invités, du lieu et des options. Les mariages se font sur devis.`,
  },
  {
    q: "Comment réserver ?",
    a: `La réservation est confirmée par le versement d'un acompte de ${ACOMPTE_PERCENT} %.`,
  },
  {
    q: "Peut-on réserver uniquement un bar gourmand ou un DJ ?",
    a: "Non. Les bars gourmands et les services complémentaires (hôtesses, traiteur, animation enfant, DJ) sont proposés en complément de nos prestations événementielles et ne peuvent pas être réservés seuls.",
  },
  {
    q: "Où intervenez-vous ?",
    a: `En ${site.areaServed.join(", ").replace(/, ([^,]*)$/, " et $1")}.`,
  },
  {
    q: "Je n'ai pas encore de date, puis-je demander un devis ?",
    a: "Oui. Le formulaire comporte une case « Je n'ai pas encore de date » : on vous aide à y voir clair.",
  },
];
