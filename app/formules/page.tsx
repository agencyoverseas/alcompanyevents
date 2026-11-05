import { ArrowRight, Heart } from "lucide-react";
import {
  ACOMPTE_PERCENT,
  complements,
  families,
  formatPrice,
  mariage,
  miniConcepts,
  services,
} from "@/content/formules";
import { devisHref } from "@/content/devis";
import { realisations } from "@/content/realisations";
import { FamilyCard } from "@/components/formules/FamilyCard";
import { CompareTable } from "@/components/formules/CompareTable";
import { OptionCard } from "@/components/formules/OptionCard";
import { ButtonLink } from "@/components/ui/Button";
import { Container, Eyebrow, Section } from "@/components/ui/Section";
import { Photo } from "@/components/ui/Photo";
import { Reveal } from "@/components/ui/Reveal";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Formules et tarifs",
  description:
    "Formules Essentiel, Signature et Prestige pour anniversaires, baptêmes et événements d'entreprise en Guadeloupe. Mariages sur devis. Prix à partir de 590 €.",
  path: "/formules",
});

const mariagePhoto = realisations.find((r) => r.id === "mariage-st")!;

export default function FormulesPage() {
  return (
    <>
      {/* En-tête */}
      <section className="relative overflow-hidden pb-10 pt-32 sm:pt-40">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-40 -top-40 size-[34rem] rounded-full [background:radial-gradient(circle,rgba(201,162,91,.16),transparent_65%)]"
        />
        <Container>
          <Reveal className="max-w-3xl">
            <Eyebrow>Formules & tarifs</Eyebrow>
            <h1 className="h1-display mt-5 text-light">
              Trois paliers, <span className="text-gold-gradient">un seul interlocuteur</span>
            </h1>
            <p className="mt-6 max-w-xl text-muted-d">
              Choisissez votre type d&apos;événement puis le niveau d&apos;accompagnement. Tous les prix sont « à partir
              de » : le devis final dépend du nombre d&apos;invités, du lieu et des options.
            </p>
          </Reveal>
          <nav aria-label="Familles de formules" className="mt-10">
            <ul className="flex flex-wrap gap-2">
              {[...families.map((f) => ({ id: f.id, name: f.name })), { id: "mariage", name: "Mariage" }].map((f) => (
                <li key={f.id}>
                  <a
                    href={`#${f.id}`}
                    className="btn-label inline-flex h-10 items-center rounded-[10px] border border-night-3 px-4 text-light/85 transition-colors hover:border-gold/60 hover:text-gold-l"
                  >
                    {f.name}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </Container>
      </section>

      {/* Familles */}
      <section aria-label="Formules par type d'événement" className="py-10 sm:py-16">
        <Container className="space-y-16 sm:space-y-20">
          {families.map((f) => (
            <FamilyCard key={f.id} family={f} />
          ))}
        </Container>
      </section>

      {/* Comparatif */}
      <Section
        id="comparatif"
        eyebrow="Comparatif"
        title={<span id="compare-title">Ce que comprend chaque palier</span>}
        intro={`Chaque palier reprend le précédent. Acompte de ${ACOMPTE_PERCENT} % à la réservation.`}
      >
        <Reveal>
          <CompareTable />
        </Reveal>
      </Section>

      {/* Mariage, traité à part */}
      <section id="mariage" aria-labelledby="mariage-title" className="scroll-mt-24 py-16 sm:py-24">
        <Container>
          <Reveal className="grid overflow-hidden rounded-[16px] border border-night-3 bg-night-2 md:grid-cols-[1fr_1.2fr]">
            <Photo
              src={mariagePhoto.src}
              alt={mariagePhoto.alt}
              sizes="(max-width: 767px) 100vw, 45vw"
              cover
              className="aspect-[4/3] md:aspect-auto md:min-h-[460px]"
            />
            <div className="flex flex-col justify-center p-6 sm:p-10 lg:p-14">
              <Eyebrow>
                <Heart className="size-3.5" aria-hidden /> Mariage
              </Eyebrow>
              <h2 id="mariage-title" className="h2-display mt-4 text-light">
                Votre mariage, <em className="text-gold-l">sur mesure</em>
              </h2>
              <p className="mt-4 text-muted-d">{mariage.pitch}</p>
              <p className="mt-6">
                <span className="smallcaps block text-muted-d">À partir de</span>
                <span className="font-display text-4xl text-gold-l">{formatPrice(mariage.priceFrom)}</span>
                <span className="ml-2 text-sm text-muted-d">sur devis</span>
              </p>
              <div className="mt-8">
                <ButtonLink href={devisHref(mariage.eventType)} size="lg">
                  Parler de mon mariage <ArrowRight className="size-4" aria-hidden />
                </ButtonLink>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* Options */}
      <Section
        id="options"
        eyebrow="Pour compléter"
        title={
          <>
            Compléments, services <em className="text-gold-l">& mini-concepts</em>
          </>
        }
      >
        <div className="grid gap-10 lg:grid-cols-3">
          <Reveal>
            <h3 className="font-display text-2xl text-light">Compléments</h3>
            <p className="mt-1 text-sm text-muted-d">À ajouter à une formule, ne peuvent pas être réservés seuls.</p>
            <ul className="mt-5 space-y-3">
              {complements.map((o) => (
                <OptionCard key={o.id} option={o} />
              ))}
            </ul>
          </Reveal>
          <Reveal delay={0.08}>
            <h3 className="font-display text-2xl text-light">Services complémentaires</h3>
            <p className="mt-1 text-sm text-muted-d">Toujours en accompagnement d&apos;une formule.</p>
            <ul className="mt-5 space-y-3">
              {services.map((o) => (
                <OptionCard key={o.id} option={o} />
              ))}
            </ul>
          </Reveal>
          <Reveal delay={0.16}>
            <h3 className="font-display text-2xl text-light">Mini-concepts</h3>
            <p className="mt-1 text-sm text-muted-d">Des formats courts, à prix fixe.</p>
            <ul className="mt-5 space-y-3">
              {miniConcepts.map((o) => (
                <OptionCard key={o.id} option={o} />
              ))}
            </ul>
            <ButtonLink href={devisHref("Mini-concept")} variant="outline" className="mt-5 w-full">
              Réserver un mini-concept
            </ButtonLink>
          </Reveal>
        </div>
      </Section>

      {/* CTA */}
      <section className="pb-24 pt-6">
        <Container>
          <Reveal className="flex flex-col items-start justify-between gap-6 rounded-[16px] border border-gold/30 bg-night-2 p-6 sm:p-10 md:flex-row md:items-center">
            <div>
              <h2 className="h2-display text-light">Pas sûr·e de la formule ?</h2>
              <p className="mt-2 text-muted-d">
                Décrivez votre événement, on vous oriente. Acompte de {ACOMPTE_PERCENT} % seulement à la réservation.
              </p>
            </div>
            <ButtonLink href="/#devis" size="lg">
              Demander un devis
            </ButtonLink>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
