// Toutes les variantes Motion du site. Ne pas en redéclarer dans les composants.
import type { Transition, Variants } from "motion/react";

export const EASE_OUT = [0.22, 1, 0.36, 1] as const;
export const EASE_IN_OUT = [0.65, 0, 0.35, 1] as const;

export const DURATION = { fast: 0.2, base: 0.6, slow: 0.9 } as const;

/** Délais de la séquence d'entrée du héro (secondes). Utilisés en CSS via style. */
export const HERO_SEQUENCE = {
  bgLight: 0,
  halos: 0.1,
  chair: 0.2,
  character: 0.45,
  balloonsStart: 0.75,
  balloonStagger: 0.07,
  logo: 0.95,
  h1Start: 1.05,
  wordStagger: 0.055,
  subtitle: 1.45,
  buttons: 1.58,
  cue: 1.8,
} as const;

/** Transition de page (ballon terracotta). */
export const PAGE_TRANSITION = {
  totalMs: 900,
  routeChangeMs: 420,
  reducedFadeMs: 200,
} as const;

export const viewportOnce = { once: true, margin: "0px 0px 12% 0px" } as const;

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: DURATION.base, ease: EASE_OUT } },
};

export const fade: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: DURATION.base, ease: EASE_OUT } },
};

export const stagger = (step = 0.08, delay = 0): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren: step, delayChildren: delay } },
});

/** Déroulé : 320 ms entre chaque étape. */
export const processStagger = stagger(0.32);

export const wordUp: Variants = {
  hidden: { y: "105%" },
  show: { y: "0%", transition: { duration: 0.7, ease: EASE_OUT } },
};

/** Variante neutralisée pour prefers-reduced-motion : simple fondu. */
export const reducedFade: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: DURATION.fast } },
};

export const tilt = {
  maxDeg: 7,
  perspective: 900,
  liftZ: 22,
  spring: { stiffness: 220, damping: 22, mass: 0.6 } satisfies Transition,
} as const;

export const modal: Variants = {
  hidden: { opacity: 0, y: 24, scale: 0.98 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.45, ease: EASE_OUT } },
  exit: { opacity: 0, y: 12, transition: { duration: DURATION.fast } },
};
