import { mariage, formatPrice, tiers } from "@/content/formules";
import { devisHref } from "@/content/devis";
import { realisations } from "@/content/realisations";
import { site } from "@/content/site";
import { ButtonLink } from "@/components/ui/Button";
import { CtaBand } from "@/components/ui/CtaBand";
import { PageHeader } from "@/components/ui/PageHeader";
import { RealisationStrip } from "@/components/ui/RealisationStrip";
import { Section } from "@/components/ui/Section";
import { Stagger, StaggerItem } from "@/components/ui/Stagger";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Décoration et organisation de mariage en Guadeloupe",
  description:
    "Décoration, scénographie et organisation de mariage en Guadeloupe, Marie-Galante, Les Saintes, La Désirade et Saint-Martin. Accompagnement sur devis à partir de 2 500 €.",
  path: "/mariage",
});

const blocks = [
  { title: "Avant le jour J", items: [...tiers[1].includes, "Coordination des prestataires"] },
  { title: "Le jour J", items: ["Installation sur place", "Présence et gestion le jour J", "Désinstallation après la fête"] },
  { title: "Selon vos besoins", items: ["Décoration seule ou organisation complète de A à Z", "Bars gourmands et services complémentaires"] },
];

export default function MariagePage() {
  const photos = realisations.filter((r) => r.univers === "mariage");
  return (
    <>
      <PageHeader
        eyebrow="Mariage"
        title={
          <>
            Votre mariage <span className="text-terra-d">en Guadeloupe</span>
          </>
        }
        intro={`${mariage.pitch} Nous intervenons en ${site.areaServed.join(", ")}.`}
      >
        <p className="mt-6">
          <span className="smallcaps mr-2 text-muted">à partir de</span>
          <span className="font-display text-[2rem] font-black text-sky-800">{formatPrice(mariage.priceFrom)}</span>
          <span className="ml-2 text-sm text-muted">sur devis</span>
        </p>
        <ButtonLink href={devisHref(mariage.eventType)} variant="terra" className="mt-5">
          Demander mon devis mariage
        </ButtonLink>
      </PageHeader>

      <Section tone="sand" eyebrow="Accompagnement" title="De la scénographie à la coordination">
        <Stagger className="grid gap-[18px] md:grid-cols-3">
          {blocks.map((b) => (
            <StaggerItem key={b.title}>
              <div className="h-full rounded-[20px] border border-line bg-white p-[26px]">
                <h2 className="font-display text-[1.18rem] font-semibold text-ink">{b.title}</h2>
                <ul className="mt-3 space-y-1.5 text-[0.9rem] text-muted">
                  {b.items.map((i) => (
                    <li key={i}>— {i}</li>
                  ))}
                </ul>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </Section>

      {photos.length > 0 && (
        <Section eyebrow="Réalisations" title="Ils nous ont confié leur mariage">
          <RealisationStrip items={photos} />
        </Section>
      )}
      <CtaBand title="Parlons de votre mariage" href={devisHref(mariage.eventType)} />
    </>
  );
}
