"use client";

import { useEffect, useRef } from "react";
import { clientLogos } from "@/content/avis";
import { Container } from "@/components/ui/Section";
import { usePrefersReducedMotion } from "@/lib/useMedia";

/**
 * Bandeau défilant des clients entreprise, en niveaux de gris. Défilement en CSS ;
 * la vitesse accélère avec la vitesse de scroll (playbackRate de l'animation).
 * Aucun fichier logo fourni : les noms sont affichés en texte.
 */
export function LogoMarquee() {
  const reduced = usePrefersReducedMotion();
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = track.current;
    if (!el || reduced) return;
    let lastY = window.scrollY;
    let lastT = performance.now();
    let rate = 1;
    let target = 1;
    let raf = 0;
    const onScroll = () => {
      const now = performance.now();
      const v = Math.abs(window.scrollY - lastY) / Math.max(1, now - lastT); // px/ms
      lastY = window.scrollY;
      lastT = now;
      target = 1 + Math.min(5, v * 2.5);
    };
    const loop = () => {
      target += (1 - target) * 0.04; // retour au calme
      rate += (target - rate) * 0.12;
      for (const a of el.getAnimations()) a.playbackRate = rate;
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [reduced]);

  const items = clientLogos.map((name) => (
    <li key={name} className="shrink-0 px-8 font-display text-2xl text-light/45 grayscale sm:px-12 sm:text-3xl">
      {name}
    </li>
  ));

  return (
    <section aria-labelledby="clients-title" className="border-y border-night-3 py-10 sm:py-14">
      <Container>
        <h2 id="clients-title" className="smallcaps text-center text-muted-d">
          Ils nous font confiance
        </h2>
      </Container>
      {reduced ? (
        <Container>
          <ul className="mt-8 flex flex-wrap justify-center gap-y-4">{items}</ul>
        </Container>
      ) : (
        <div className="mt-8 overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)]">
          <div ref={track} className="flex w-max [animation:marquee_38s_linear_infinite]">
            <ul className="flex">{items}</ul>
            <ul className="flex" aria-hidden>
              {items}
            </ul>
          </div>
        </div>
      )}
    </section>
  );
}
