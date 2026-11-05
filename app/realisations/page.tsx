import { RealisationsView } from "@/components/realisations/RealisationsView";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Réalisations : mariages, baptêmes, anniversaires en Guadeloupe",
  description:
    "Découvrez les décorations et événements réalisés par Audrey.L Company en Guadeloupe : mariages, baptêmes, anniversaires, arbres de Noël d'entreprise et scénographies sur mesure.",
  path: "/realisations",
});

export default function RealisationsPage() {
  return <RealisationsView />;
}
