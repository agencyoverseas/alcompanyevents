import { Check } from "lucide-react";
import { COMPLEMENT_NOTE, SERVICES_NOTE, complements, formatPrice, services } from "@/content/formules";
import { ClientLogos } from "@/components/home/ClientLogos";
import { ButtonLink } from "@/components/ui/Button";
import { CtaBand } from "@/components/ui/CtaBand";
import { PageHeader } from "@/components/ui/PageHeader";
import { PhotoSlot } from "@/components/ui/PhotoSlot";
import { Section } from "@/components/ui/Section";
import { Stagger, StaggerItem } from "@/components/ui/Stagger";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Prestations : décoration, organisation, bars gourmands et services",
  description:
    "Événements privés et professionnels, scénographie, bars à gaufres, pop-corn et barbe à papa, hôtesses, traiteur, animation enfant et DJ en complément de nos prestations, en Guadeloupe.",
  path: "/prestations",
});

const kinds = [
  {
    title: "Événements privés",
    text: "Anniversaires, baptêmes, mariages, baby showers et gender reveal : une décoration et une organisation qui vous ressemblent.",
    href: "/formules",
    cta: "Voir les formules",
  },
  {
    title: "Événements professionnels",
    text: "CSE, arbres de Noël, séminaires, inaugurations : une scénographie alignée sur votre image, un interlocuteur unique.",
    href: "/devis?type=Entreprise",
    cta: "Devis entreprise",
  },
  {
    title: "Scénographie & clé en main",
    text: "De la scénographie à l'organisation complète et à la coordination des prestataires, selon le niveau d'accompagnement choisi.",
    href: "/comment-ca-se-passe",
    cta: "Comment ça se passe",
  },
];

export default function PrestationsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Prestations"
        title={
          <>
            Une expérience <span className="text-terra-d">complète</span>, pas seulement un décor
          </>
        }
        intro="Nous concevons votre événement de la scénographie jusqu'à l'organisation et la coordination, selon vos besoins."
      />

      <Section tone="paper" className="pt-4 sm:pt-6">
        <Stagger className="grid gap-[18px] md:grid-cols-3">
          {kinds.map((k) => (
            <StaggerItem key={k.title}>
              <div className="flex h-full flex-col rounded-[20px] border border-line bg-white p-[26px]">
                <h2 className="font-display text-[1.18rem] font-semibold text-ink">{k.title}</h2>
                <p className="mt-2 flex-1 text-[0.9rem] text-muted">{k.text}</p>
                <ButtonLink href={k.href} variant="outline" size="sm" className="mt-5 self-start">
                  {k.cta}
                </ButtonLink>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </Section>

      {/* 4. Bars personnalisés & animations gourmandes */}
      <Section
        id="bars"
        tone="sand"
        eyebrow="Bars personnalisés & animations gourmandes"
        title={
          <>
            Une touche <em>gourmande</em> pour vos invités
          </>
        }
        intro={COMPLEMENT_NOTE}
      >
        <Stagger className="grid gap-[18px] sm:grid-cols-2 lg:grid-cols-4">
          {complements.map((c) => (
            <StaggerItem key={c.id}>
              <article className="flex h-full flex-col overflow-hidden rounded-[20px] border border-line bg-white">
                <PhotoSlot src={c.photo} label={c.name} sizes="(max-width: 639px) 92vw, 280px" className="aspect-[4/3]" />
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="font-display text-[1.1rem] font-semibold text-ink">{c.name}</h3>
                  <p className="mt-1.5 flex-1 text-[0.88rem] text-muted">{c.text}</p>
                  <p className="mt-3">
                    {c.price !== null && <span className="smallcaps mr-1.5 text-muted">à partir de</span>}
                    <span className="font-display text-xl font-black text-sky-800">{formatPrice(c.price, "Sur demande")}</span>
                  </p>
                </div>
              </article>
            </StaggerItem>
          ))}
        </Stagger>
        <ButtonLink href="/devis" variant="terra" className="mt-7">
          Ajouter un bar à mon devis
        </ButtonLink>
      </Section>

      {/* 5. Services complémentaires */}
      <Section
        id="services"
        eyebrow="Services complémentaires"
        title="Tout ce qu'il faut autour de votre événement"
        intro={SERVICES_NOTE}
      >
        <ul className="grid gap-3 sm:grid-cols-2">
          {services.map((s) => (
            <li key={s.id} className="flex items-center justify-between gap-4 rounded-[20px] border border-line bg-white px-5 py-4">
              <span className="flex items-center gap-3 font-medium text-ink">
                <Check className="size-4 text-sky-600" aria-hidden /> {s.name}
              </span>
              <span className="shrink-0 text-right">
                {s.price !== null && <span className="smallcaps mr-1.5 text-muted">dès</span>}
                <span className="font-display text-lg font-black text-sky-800">{formatPrice(s.price)}</span>
              </span>
            </li>
          ))}
        </ul>
      </Section>

      <ClientLogos />
      <CtaBand />
    </>
  );
}
