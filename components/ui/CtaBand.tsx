import { Phone } from "lucide-react";
import { CTA } from "@/content/nav";
import { site, telHref } from "@/content/site";
import { ButtonLink } from "./Button";
import { Container } from "./Section";
import { Reveal } from "./Reveal";

/** Bandeau d'appel à l'action « Parlons de votre projet » (répété sur le site). */
export function CtaBand({
  title = "Parlons de votre projet",
  text = "Quelques informations suffisent pour recevoir votre proposition et votre devis détaillé.",
  href = CTA.href,
  label = CTA.devis,
}: {
  title?: string;
  text?: string;
  href?: string;
  label?: string;
}) {
  return (
    <section className="py-10 sm:py-14">
      <Container>
        <Reveal className="bg-hero relative overflow-hidden rounded-[34px] px-6 py-10 text-white sm:px-12 sm:py-14">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-20 -top-24 size-80 rounded-full [background:radial-gradient(closest-side,rgba(194,100,62,.4),transparent)]"
          />
          <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="max-w-xl">
              <h2 className="h2-display text-white">{title}</h2>
              <p className="mt-3 text-white/85">{text}</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <ButtonLink href={href} variant="light" size="lg">
                {label}
              </ButtonLink>
              <ButtonLink href={telHref} variant="ghostLight" size="lg">
                <Phone className="size-4" aria-hidden /> {site.phoneDisplay}
              </ButtonLink>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
