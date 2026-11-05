import { DevisForm } from "@/components/home/DevisForm";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Demande de devis",
  description:
    "Parlons de votre projet : décrivez votre événement (date, lieu, invités, ambiance, budget) et recevez votre proposition et votre devis détaillé. Guadeloupe et îles alentours.",
  path: "/devis",
});

export default function DevisPage() {
  return <DevisForm />;
}
