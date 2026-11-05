"use client";

import dynamic from "next/dynamic";
import { ArrowRight, MapPin } from "lucide-react";
import { useRef } from "react";
import { featuredRealisations, placeLabel } from "@/content/realisations";
import { Container, Eyebrow } from "@/components/ui/Section";
import { Photo } from "@/components/ui/Photo";
import { Reveal } from "@/components/ui/Reveal";
import { TransitionLink } from "@/components/layout/PageTransition";
import { useCanPin } from "@/lib/useMedia";
import { cn } from "@/lib/utils";

// GSAP n'est chargé que si le pin est autorisé (≥ 768px, mouvement non réduit).
const RailPin = dynamic(() => import("./RailPin"), { ssr: false });

/**
 * Réalisations en scroll horizontal. Bureau : pin + scrub GSAP (on défile
 * verticalement, le rail avance latéralement). Mobile / mouvement réduit :
 * défilement natif avec scroll-snap, sans pin.
 * Titre + commune sur chaque photo : c'est du référencement local.
 */
export function HorizontalRail() {
  const canPin = useCanPin();
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLUListElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);

  return (
    <section
      ref={sectionRef}
      aria-labelledby="rail-title"
      className={cn(
        "relative overflow-hidden bg-sand py-14 sm:py-[76px]",
        canPin && "md:flex md:h-[100svh] md:flex-col md:justify-center md:py-0",
      )}
    >
      <Container className="mb-8 flex flex-col gap-5 sm:mb-10 md:flex-row md:items-end md:justify-between">
        <Reveal>
          <Eyebrow>Réalisations</Eyebrow>
          <h2 id="rail-title" className="h2-display max-w-xl text-ink">
            Des fêtes qu&apos;on <em>n&apos;oublie pas</em>
          </h2>
        </Reveal>
        <TransitionLink
          href="/realisations"
          className="btn-label inline-flex items-center gap-2 text-terra-d hover:underline hover:underline-offset-4"
        >
          Toutes nos réalisations <ArrowRight className="size-4" aria-hidden />
        </TransitionLink>
      </Container>

      <div
        ref={viewportRef}
        className={cn(
          canPin
            ? "overflow-hidden"
            : "snap-x snap-mandatory overflow-x-auto overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
        )}
      >
        <ul
          ref={trackRef}
          className="flex w-max gap-4 px-4 sm:px-6 md:gap-6 lg:px-[max(22px,calc((100vw-1180px)/2+22px))]"
        >
          {featuredRealisations.map((r, i) => (
            <li key={r.id} className="snap-start scroll-ml-4">
              <TransitionLink href="/realisations" data-cursor="view" className="group block rounded-[20px]">
                <figure>
                  <Photo
                    src={r.src}
                    alt={r.alt}
                    sizes="(max-width: 767px) 72vw, 340px"
                    className="aspect-[400/516] w-[72vw] rounded-[20px] sm:w-[300px] md:w-[min(24vw,340px)]"
                    imgClassName="transition-transform duration-700 group-hover:scale-[1.04]"
                  />
                  <figcaption className="mt-4 flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-display text-xl font-semibold text-ink">{r.title}</h3>
                      <p className="mt-1 flex items-center gap-1.5 text-sm text-muted">
                        <MapPin className="size-3.5" aria-hidden /> {placeLabel(r)}
                      </p>
                    </div>
                    <span className="font-display text-lg text-terra-d" aria-hidden>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </figcaption>
                </figure>
              </TransitionLink>
            </li>
          ))}
          <li className="snap-start">
            <TransitionLink
              href="/realisations"
              className="flex aspect-[400/516] w-[60vw] flex-col items-start justify-end rounded-[20px] border border-line bg-white p-6 transition-colors hover:border-terra sm:w-[260px] md:w-[min(20vw,280px)]"
            >
              <span className="smallcaps text-terra-d">Galerie complète</span>
              <span className="mt-3 font-display text-3xl font-semibold leading-tight text-ink">Voir toutes nos réalisations</span>
              <ArrowRight className="mt-6 size-5 text-terra-d" aria-hidden />
            </TransitionLink>
          </li>
        </ul>
      </div>

      {canPin && <RailPin sectionRef={sectionRef} trackRef={trackRef} viewportRef={viewportRef} />}
    </section>
  );
}
