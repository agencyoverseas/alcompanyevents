import { families, formatPrice, tiers } from "@/content/formules";
import { devisHref } from "@/content/devis";
import { realisations } from "@/content/realisations";
import { ButtonLink } from "@/components/ui/Button";
import { CtaBand } from "@/components/ui/CtaBand";
import { PageHeader } from "@/components/ui/PageHeader";
import { RealisationStrip } from "@/components/ui/RealisationStrip";
import { Section } from "@/components/ui/Section";
import { Stagger, StaggerItem } from "@/components/ui/Stagger";
import { cn } from "@/lib/utils";
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
        <Stagger className="grid gap-[18px] md:grid-cols-3">
          {tiers.map((t) => (
            <StaggerItem key={t.id}>
              <div className={cn("flex h-full flex-col rounded-[20px] border bg-white p-[26px]", t.popular ? "border-terra" : "border-line")}>
                <h2 className="font-display text-xl font-semibold text-ink">{t.name}</h2>
                <p className="mt-1 text-[0.9rem] text-muted">{t.tagline}</p>
                <p className="mt-4">
                  <span className="smallcaps mr-1.5 text-muted">à partir de</span>
                  <span className="font-display text-[1.75rem] font-black text-sky-800">{formatPrice(fam.prices[t.id])}</span>
                </p>
                <ButtonLink href={devisHref(fam.eventType, t.name)} variant={t.popular ? "terra" : "outline"} size="sm" className="mt-5 self-start">
                  Choisir {t.name}
                </ButtonLink>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
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
