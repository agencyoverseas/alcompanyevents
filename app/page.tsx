import { Hero } from "@/components/home/Hero";
import { HorizontalRail } from "@/components/home/HorizontalRail";
import { Process } from "@/components/home/Process";
import { Avis } from "@/components/home/Avis";
import { ClientLogos } from "@/components/home/ClientLogos";
import { AboutTeaser } from "@/components/home/AboutTeaser";
import { FamilyGrid } from "@/components/formules/FamilyGrid";
import { ButtonLink } from "@/components/ui/Button";
import { CtaBand } from "@/components/ui/CtaBand";
import { Section } from "@/components/ui/Section";
import { CTA } from "@/content/nav";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Décoration & organisation d'événements clé en main en Guadeloupe",
  description:
    "Anniversaires, baptêmes, mariages, événements professionnels : Audrey.L Company conçoit, décore, organise et coordonne votre événement en Guadeloupe, Marie-Galante, Les Saintes, La Désirade et Saint-Martin.",
  path: "/",
});

// Parcours voulu par la cliente :
// je découvre → je m'inspire → je choisis mon niveau → je comprends comment ça marche
// → je suis rassuré·e (réalisations, avis, références) → je demande mon devis.
export default function Home() {
  return (
    <>
      <Hero />
      <HorizontalRail />
      <Section
        id="formules"
        eyebrow="Nos formules"
        title={
          <>
            Choisissez votre univers, <em>puis votre niveau</em>
          </>
        }
        intro="Quatre univers, trois niveaux d'accompagnement : de la décoration installée à l'organisation complète avec coordination le jour J."
      >
        <FamilyGrid />
        <div className="mt-7 flex flex-wrap gap-3">
          <ButtonLink href="/formules" variant="outline">
            Voir le détail des formules
          </ButtonLink>
          <ButtonLink href="/mariage" variant="outline">
            Mariage : sur devis
          </ButtonLink>
        </div>
      </Section>
      <CtaBand title="Une idée, une date, une envie ?" />
      <Process />
      <Avis />
      <ClientLogos />
      <AboutTeaser />
      <CtaBand title={CTA.main} text="Remplissez notre formulaire : vous recevrez votre planche d'inspiration, votre proposition et votre devis détaillé." />
    </>
  );
}
