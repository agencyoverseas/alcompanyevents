// État partagé entre GSAP (DOM) et la boucle R3F, sans re-rendu React.
import { HERO_SEQUENCE } from "@/lib/motion";

export const sceneState = {
  /** Progression du pin (0 → 1), écrite par la timeline GSAP lissée. */
  progress: 0,
  /** Horloge R3F (s) au lancement de la séquence d'entrée ; -1 = pas encore lancée. */
  introStart: -1,
  /** Position du pointeur normalisée (-1 → 1), écrite par un listener window. */
  pointer: { x: 0, y: 0 },
};

/** Temps écoulé depuis le début de la séquence d'entrée (s), ou -1. */
export const introTime = (elapsed: number) =>
  sceneState.introStart < 0 ? -1 : elapsed - sceneState.introStart;

export const SEQ = HERO_SEQUENCE;

// ⚠️ À RECALER sur la vraie image character.png : position de la main qui tient les
// ficelles, en coordonnées UV (0,0 = coin haut-gauche de l'image).
export const HAND_UV = { u: 560 / 900, v: 300 / 1100 };

export const CHARACTER = {
  /** Hauteur du plan en unités monde (caméra à z=5, fov 35 → ~3,15 visibles). */
  height: 1.8,
  y: -0.62,
  /** Décalage horizontal en fraction de la largeur visible. */
  xFactor: 0.23,
  /** < 0.35 impératif (cheveux sombres qui se creusent au-delà). */
  displacementScale: 0.22,
  /** Flou appliqué à la carte de profondeur (fraction de sa largeur) : adoucit la
   *  marche au bord de la silhouette, sinon le contour se découpe en escalier. */
  depthBlur: 0.012,
  segments: [140, 170] as const,
};

export const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
export const easeOutBack = (x: number, s = 1.70158) => {
  const c3 = s + 1;
  return 1 + c3 * Math.pow(x - 1, 3) + s * Math.pow(x - 1, 2);
};
export const easeOutCubic = (x: number) => 1 - Math.pow(1 - x, 3);
export const easeInOutSine = (x: number) => -(Math.cos(Math.PI * x) - 1) / 2;
