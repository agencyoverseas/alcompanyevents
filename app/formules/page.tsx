import { ArrowRight, Heart } from "lucide-react";
import { ACOMPTE_PERCENT, families, formatPrice, mariage, miniConcepts } from "@/content/formules";
import { devisHref } from "@/content/devis";
import { realisations } from "@/content/realisations";
import { FamilyCard } from "@/components/formules/FamilyCard";
import { CompareTable } from "@/components/formules/CompareTable";
import { OptionCard } from "@/components/formules/OptionCard";
import { ButtonLink } from "@/components/ui/Button";
import { CtaBand } from "@/components/ui/CtaBand";
import { Container, Eyebrow, Section } from "@/components/ui/Section";
import { Photo } from "@/components/ui/Photo";
import { Reveal } from "@/components/ui/Reveal";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Formules et tarifs",
  description:
    "Formules Essentiel, Signature et Prestige pour anniversaires, baptêmes et événements professionnels en Guadeloupe. Mariages sur devis. Prix à partir de 590 €.",
  path: "/formules",
});

const mariagePhoto = realisations.find((r) => r.id === "mariage-st")!;

export default function FormulesPage() {
  return (
    <>
      <section className="pb-6 pt-28 sm:pt-32">
        <Container>
          <Reveal className="max-w-3xl">
            <Eyebrow>Formules & tarifs</Eyebrow>
            <h1 className="h1-display text-ink">
              Choisissez votre univers, <span className="text-terra-d">puis votre niveau</span>
            </h1>
            <p className="mt-5 max-w-[60ch] text-[1.05rem] text-muted">
              Tous les tarifs sont indiqués « à partir de » et dépendent du nombre d&apos;invités, du lieu et des
              options. Le mariage se traite sur devis, chaque projet étant unique.
            </p>
          </Reveal>
          <nav aria-label="Familles de formules" className="mt-8">
            <ul className="flex flex-wrap gap-2">
              {[...families.map((f) => ({ id: f.id, name: f.name })), { id: "mariage", name: "Mariage" }].map((f) => (
                <li key={f.id}>
                  <a
                    href={`#${f.id}`}
                    className="inline-flex h-10 items-center rounded-full border border-sky-200 bg-white px-4 text-[0.82rem] font-medium text-ink transition-colors hover:bg-sky-50"
                  >
                    {f.name}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </Container>
      </section>

      <section aria-label="Formules par type d'événement" className="py-10 sm:py-14">
        <Container className="space-y-14 sm:space-y-16">
          {families.map((f) => (
            <FamilyCard key={f.id} family={f} />
          ))}
        </Container>
      </section>

      <CtaBand title="Vous hésitez entre deux niveaux ?" text="Décrivez votre événement, on vous oriente vers la formule la plus juste." />

      <Section
        id="comparatif"
        eyebrow="Comparatif"
        title={<span id="compare-title">Ce que contient chaque niveau</span>}
        intro={`Chaque niveau reprend le précédent. Acompte de ${ACOMPTE_PERCENT} % à la réservation.`}
      >
        <Reveal>
          <CompareTable />
        </Reveal>
      </Section>

      <section id="mariage" aria-labelledby="mariage-title" className="scroll-mt-24 py-12 sm:py-16">
        <Container>
          <Reveal className="grid overflow-hidden rounded-[34px] border border-line bg-white md:grid-cols-[1fr_1.2fr]">
            <Photo
              src={mariagePhoto.src}
              alt={mariagePhoto.alt}
              sizes="(max-width: 767px) 100vw, 45vw"
              cover
              className="aspect-[4/3] md:aspect-auto md:min-h-[440px]"
            />
            <div className="flex flex-col justify-center p-6 sm:p-10 lg:p-12">
              <Eyebrow>
                <Heart className="size-3.5" aria-hidden /> Mariage
              </Eyebrow>
              <h2 id="mariage-title" className="h2-display text-ink">
                Votre mariage, <em>sur mesure</em>
              </h2>
              <p className="mt-4 text-muted">{mariage.pitch}</p>
              <p className="mt-6">
                <span className="smallcaps mr-2 text-muted">à partir de</span>
                <span className="font-display text-[2rem] font-black text-sky-800">{formatPrice(mariage.priceFrom)}</span>
                <span className="ml-2 text-sm text-muted">sur devis</span>
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <ButtonLink href={devisHref(mariage.eventType)} variant="terra">
                  Demander mon devis mariage <ArrowRight className="size-4" aria-hidden />
                </ButtonLink>
                <ButtonLink href="/mariage" variant="outline">
                  En savoir plus
                </ButtonLink>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>

      <Section tone="sand" id="mini-concepts" eyebrow="Petits formats" title="Nos mini-concepts">
        <ul className="grid gap-3 md:grid-cols-3">
          {miniConcepts.map((o) => (
            <OptionCard key={o.id} option={o} />
          ))}
        </ul>
        <div className="mt-8 flex flex-col gap-4 rounded-[20px] border border-line bg-white p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="font-display text-xl font-semibold text-ink">À ajouter à votre formule</h3>
            <p className="mt-1 text-[0.9rem] text-muted">
              Bars gourmands (gaufres, pop-corn, barbe à papa, sweet table) et services complémentaires (hôtesses,
              traiteur, animation, DJ).
            </p>
          </div>
          <ButtonLink href="/prestations" variant="outline">
            Voir les prestations
          </ButtonLink>
        </div>
      </Section>

      <CtaBand />
    </>
  );
}
