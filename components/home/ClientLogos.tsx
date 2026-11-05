import Image from "next/image";
import { clientLogos } from "@/content/avis";
import { CTA } from "@/content/nav";
import { ButtonLink } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";
import { Stagger, StaggerItem } from "@/components/ui/Stagger";

/** « Ils nous ont fait confiance » : crédibilité immédiate pour la clientèle pro. */
export function ClientLogos({ withCta = true }: { withCta?: boolean }) {
  return (
    <Section
      id="references"
      tone="dark"
      eyebrow="Entreprises & institutions"
      title="Ils nous ont fait confiance"
      intro="Devis sur mesure, interlocuteur unique du brief au démontage."
    >
      <Stagger className="grid grid-cols-2 gap-3 sm:gap-[18px] lg:grid-cols-5">
        {clientLogos.map((c) => (
          <StaggerItem key={c.name}>
            <div className="grid h-[96px] place-items-center rounded-[20px] border border-[#2B4557] bg-ink-soft px-4 text-center">
              {c.logo ? (
                <Image src={c.logo} alt={c.name} width={160} height={60} className="max-h-12 w-auto object-contain opacity-80 grayscale" />
              ) : (
                <span className="font-display text-[0.98rem] font-semibold leading-tight text-[#DCE7EF]">{c.name}</span>
              )}
            </div>
          </StaggerItem>
        ))}
      </Stagger>
      {withCta && (
        <ButtonLink href={`${CTA.href}?type=Entreprise`} variant="terra" className="mt-7">
          Demander un devis entreprise
        </ButtonLink>
      )}
    </Section>
  );
}
