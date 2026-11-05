import { Process } from "@/components/home/Process";
import { ButtonLink } from "@/components/ui/Button";
import { CtaBand } from "@/components/ui/CtaBand";
import { PageHeader } from "@/components/ui/PageHeader";
import { ACOMPTE_PERCENT } from "@/content/formules";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Comment ça se passe ?",
  description:
    "4 étapes et vous n'avez plus rien à gérer : on discute, on imagine, on valide, on installe et vous profitez. Décoration et organisation d'événements en Guadeloupe.",
  path: "/comment-ca-se-passe",
});

export default function CommentPage() {
  return (
    <>
      <PageHeader
        eyebrow="Comment ça se passe ?"
        title={
          <>
            De votre premier message <span className="text-terra-d">à la fin de la fête</span>
          </>
        }
        intro={`Aucune surprise : voici ce qui se passe après votre demande. La réservation est confirmée par un acompte de ${ACOMPTE_PERCENT} %.`}
      >
        <div className="mt-6 flex flex-wrap gap-3">
          <ButtonLink href="/devis">Je demande mon devis</ButtonLink>
          <ButtonLink href="/faq" variant="outline">
            Questions fréquentes
          </ButtonLink>
        </div>
      </PageHeader>
      <Process eyebrow="Les 4 étapes" tone="sand" />
      <CtaBand />
    </>
  );
}
