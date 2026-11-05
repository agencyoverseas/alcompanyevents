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
    // Animation CSS mise en cache : getAnimations() force un recalcul de style,
    // on ne l'appelle qu'une fois. La boucle ne tourne que pendant/après un scroll
    // et seulement quand le bandeau est visible.
    let anim: Animation | undefined;
    let visible = false;
    let lastY = window.scrollY;
    let lastT = performance.now();
    let rate = 1;
    let target = 1;
    let raf = 0;
    const loop = () => {
      target += (1 - target) * 0.04;
      rate += (target - rate) * 0.12;
      anim ??= el.getAnimations()[0];
      if (anim) anim.playbackRate = rate;
      if (Math.abs(rate - 1) < 0.01 && Math.abs(target - 1) < 0.01) {
        if (anim) anim.playbackRate = 1;
        raf = 0;
        return;
      }
      raf = requestAnimationFrame(loop);
    };
    const onScroll = () => {
      const now = performance.now();
      const v = Math.abs(window.scrollY - lastY) / Math.max(1, now - lastT); // px/ms
      lastY = window.scrollY;
      lastT = now;
      if (!visible) return;
      target = 1 + Math.min(5, v * 2.5);
      if (!raf) raf = requestAnimationFrame(loop);
    };
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(el);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      io.disconnect();
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
