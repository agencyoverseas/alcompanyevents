import { ArrowUpRight } from "lucide-react";
import { univers } from "@/content/univers";
import { formatPrice } from "@/content/formules";
import { Section } from "@/components/ui/Section";
import { Stagger, StaggerItem } from "@/components/ui/Stagger";
import { TiltCard } from "@/components/ui/TiltCard";
import { Photo } from "@/components/ui/Photo";
import { TransitionLink } from "@/components/layout/PageTransition";

export function Univers() {
  return (
    <Section
      id="univers"
      eyebrow="Nos univers"
      title={
        <>
          Quatre univers, <em className="text-gold-l">une même exigence</em>
        </>
      }
      intro="Chaque événement est pensé, installé et démonté par nos soins. Vous choisissez l'univers, on s'occupe du reste."
    >
      <Stagger className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
        {univers.map((u) => (
          <StaggerItem key={u.id}>
            <TransitionLink
              href={u.href}
              data-cursor="view"
              className="group block aspect-[400/560] rounded-[10px] focus-visible:outline-offset-4"
            >
              <TiltCard
                className="rounded-[10px]"
                layer={
                  <Photo
                    src={u.src}
                    alt={u.alt}
                    sizes="(max-width: 1023px) 50vw, 300px"
                    className="h-full rounded-[10px]"
                    imgClassName="transition-transform duration-700 group-hover:scale-[1.04]"
                  />
                }
              >
                <div className="pointer-events-none absolute inset-0 rounded-[10px] bg-gradient-to-t from-night/70 via-transparent to-transparent" />
                <div
                  className="absolute inset-x-0 bottom-0 rounded-b-[10px] border-t border-light/10 bg-night/85 p-3 backdrop-blur-sm sm:p-5"
                  style={{ transform: "translateZ(30px)" }}
                >
                  <h3 className="font-display text-xl leading-tight text-light sm:text-2xl">{u.title}</h3>
                  <p className="mt-1 hidden text-sm text-muted-d sm:block">{u.pitch}</p>
                  <div className="mt-3 flex items-end justify-between border-t border-light/15 pt-3">
                    <p className="text-light">
                      <span className="smallcaps block text-muted-d">À partir de</span>
                      <span className="font-display text-xl text-gold-l sm:text-2xl">{formatPrice(u.priceFrom)}</span>
                    </p>
                    <ArrowUpRight
                      className="size-5 text-gold-l transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                      aria-hidden
                    />
                  </div>
                </div>
              </TiltCard>
            </TransitionLink>
          </StaggerItem>
        ))}
      </Stagger>
    </Section>
  );
}
