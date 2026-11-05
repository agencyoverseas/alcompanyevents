import { families, formatPrice, tiers } from "@/content/formules";
import { devisHref } from "@/content/devis";
import { realisations } from "@/content/realisations";
import { ButtonLink } from "@/components/ui/Button";
import { CtaBand } from "@/components/ui/CtaBand";
import { PageHeader } from "@/components/ui/PageHeader";
import { RealisationStrip } from "@/components/ui/RealisationStrip";
import { Section } from "@/components/ui/Section";
import { TierCard } from "@/components/formules/TierCard";
import { pageMetadata } from "@/lib/seo";

const fam = families.find((f) => f.id === "anniversaire-enfant")!;

export const metadata = pageMetadata({
  title: "Anniversaire d'enfant clé en main en Guadeloupe",
  description: `Décoration et organisation d'anniversaire d'enfant en Guadeloupe : thème, décor, installation et démontage. Formules à partir de ${formatPrice(fam.prices.essentiel)}.`,
  path: "/anniversaire-enfant",
});

export default function AnnivEnfantPage() {
  const photos = realisations.filter((r) => r.univers === "anniversaire");
  return (
    <>
      <PageHeader
        eyebrow="Anniversaire enfant"
        title={
          <>
            Un anniversaire <span className="text-terra-d">clé en main</span> en Guadeloupe
          </>
        }
        intro="Vous choisissez le thème, nous nous occupons du reste : décoration, installation sur place et démontage après la fête. Et si vous le souhaitez, l'organisation complète."
      >
        <ButtonLink href={devisHref(fam.eventType)} className="mt-6">
          Je demande mon devis
        </ButtonLink>
      </PageHeader>

      <Section tone="sand" eyebrow="Trois niveaux" title="Choisissez votre accompagnement">
        <ul className="grid items-start gap-3 md:grid-cols-3 md:gap-4">
          {tiers.map((t) => (
            <li key={t.id}>
              <TierCard family={fam} tier={t} />
            </li>
          ))}
        </ul>
      </Section>

      {photos.length > 0 && (
        <Section eyebrow="Réalisations" title="Quelques anniversaires réalisés">
          <RealisationStrip items={photos} />
        </Section>
      )}
      <CtaBand />
    </>
  );
}
