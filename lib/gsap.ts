"use client";

// Point d'entrée unique de GSAP. N'importer GSAP/ScrollTrigger QUE depuis ce fichier,
// et uniquement depuis des composants chargés en next/dynamic (bureau) : GSAP ne
// doit pas peser sur le bundle mobile.
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/** Réglages de scroll centralisés. */
export const SCROLL = {
  hero: {
    /** Pin sur trois hauteurs d'écran. */
    end: "+=300%",
    scrub: 0.6,
    /** Tranches de la timeline (progression 0 → 1), cf. brief §5. */
    phases: {
      stringsRelax: [0, 0.3],
      camera: [0.2, 0.7],
      balloonsRise: [0.3, 1],
      textOut: [0.6, 1],
    },
    camera: { zFrom: 5, zTo: 3.4 },
  },
  rail: { scrub: 0.8 },
  lenis: { lerp: 0.1, wheelMultiplier: 1 },
} as const;

/** smoothstep borné sur une tranche [a, b] de la progression. */
export function phase(p: number, [a, b]: readonly [number, number]) {
  const t = Math.min(1, Math.max(0, (p - a) / (b - a)));
  return t * t * (3 - 2 * t);
}

export { gsap, ScrollTrigger, useGSAP };

/**
 * Un pin ajoute de la hauteur après le premier rendu : si l'URL vise une ancre
 * (ex. /#devis depuis une formule), on y re-défile une fois les pins posés.
 */
export function rescrollToHash() {
  const hash = window.location.hash;
  if (!hash || hash.length < 2) return;
  requestAnimationFrame(() => {
    ScrollTrigger.refresh();
    const el = document.getElementById(decodeURIComponent(hash.slice(1)));
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 80, behavior: "instant" });
  });
}
