"use client";

import dynamic from "next/dynamic";
import { MapPin } from "lucide-react";
import { useState } from "react";
import { placeLabel, realisations, universFilters, universLabels as universLabel } from "@/content/realisations";
import { CtaBand } from "@/components/ui/CtaBand";
import { Container, Eyebrow } from "@/components/ui/Section";
import { Photo } from "@/components/ui/Photo";
import { Reveal } from "@/components/ui/Reveal";
import { useCanPin } from "@/lib/useMedia";
import { cn } from "@/lib/utils";

const RingCarousel = dynamic(() => import("./RingCarousel"), { ssr: false });


type Filter = (typeof universFilters)[number]["id"];

export function RealisationsView() {
  const canPin = useCanPin();
  const [filter, setFilter] = useState<Filter>("tout");
  const shown = filter === "tout" ? realisations : realisations.filter((r) => r.univers === filter);

  return (
    <>
      {/* En-tête + carrousel en anneau */}
      <section aria-labelledby="real-title" className="relative overflow-hidden pb-10 pt-28 sm:pt-32">
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-40 size-[44rem] -translate-x-1/2 rounded-full [background:radial-gradient(circle,rgba(111,170,211,.18),transparent_65%)]"
        />
        <Container>
          <Reveal className="mx-auto max-w-3xl text-center">
            <Eyebrow className="justify-center">Réalisations</Eyebrow>
            <h1 id="real-title" className="h1-display text-ink">
              Des fêtes qui <span className="text-terra-d">nous ressemblent</span>
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-muted">
              Mariages, baptêmes, anniversaires et arbres de Noël d&apos;entreprise en Guadeloupe : un aperçu de ce
              que nous avons imaginé, installé et démonté pour nos clients.
            </p>
          </Reveal>
        </Container>

        <div className="mt-12">
          {canPin ? (
            <RingCarousel items={realisations} />
          ) : (
            <ul
              aria-label="Aperçu des réalisations"
              className="flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 [scrollbar-width:none] sm:px-6 [&::-webkit-scrollbar]:hidden"
            >
              {realisations.slice(0, 8).map((r) => (
                <li key={r.id} className="shrink-0 snap-center">
                  <Photo src={r.src} alt={r.alt} sizes="62vw" className="aspect-[400/516] w-[62vw] max-w-[300px] rounded-[20px]" />
                  <p className="mt-2 font-display text-lg font-semibold text-ink">{r.title}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* Galerie immersive filtrable */}
      <section aria-labelledby="galerie-title" className="py-16 sm:py-24">
        <Container>
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <Eyebrow>Galerie</Eyebrow>
              <h2 id="galerie-title" className="h2-display text-ink">
                Par <em>univers</em>
              </h2>
            </div>
            <div role="group" aria-label="Filtrer par univers" className="flex flex-wrap gap-2">
              {universFilters.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  aria-pressed={filter === f.id}
                  onClick={() => setFilter(f.id)}
                  className={cn(
                    "h-10 rounded-full border px-4 text-[0.8rem] transition-colors",
                    filter === f.id
                      ? "border-terra bg-terra text-white"
                      : "border-sky-200 bg-white text-ink hover:bg-sky-50",
                  )}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
          <p className="sr-only" aria-live="polite">
            {shown.length} réalisation{shown.length > 1 ? "s" : ""} affichée{shown.length > 1 ? "s" : ""}
          </p>

          <ul key={filter} className="mt-12 grid gap-8 md:grid-cols-2 md:gap-x-10 md:gap-y-16">
            {shown.map((r, i) => (
              <li key={r.id} className={cn("immersive-item", i % 2 === 1 && "md:translate-y-24")}>
                <figure className="immersive-frame relative overflow-hidden rounded-[20px]" data-cursor="view">
                  <div className="immersive-photo">
                    <Photo
                      src={r.src}
                      alt={r.alt}
                      sizes="(max-width: 767px) 92vw, 45vw"
                      cover
                      className="aspect-[4/5]"
                    />
                  </div>
                  <figcaption className="immersive-caption absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink via-ink/80 to-transparent p-5 pt-16 sm:p-7 sm:pt-20">
                    <p className="smallcaps text-terra-soft">{universLabel[r.univers]}</p>
                    <h3 className="mt-2 font-display text-2xl font-semibold text-white sm:text-3xl">{r.title}</h3>
                    <p className="mt-1 flex items-center gap-1.5 text-sm text-white/85">
                      <MapPin className="size-3.5" aria-hidden /> {placeLabel(r)}
                    </p>
                  </figcaption>
                </figure>
              </li>
            ))}
          </ul>

        </Container>
      </section>
      <div className="md:mt-20">
        <CtaBand title="Votre événement pourrait être le prochain" />
      </div>
    </>
  );
}
