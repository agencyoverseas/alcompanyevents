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

// Position du poing qui tient les ficelles dans character.webp, en UV
// (0,0 = coin haut-gauche). Mesurée sur la mascotte fournie (voir public/scene/README.md).
export const HAND_UV = { u: 0.3515, v: 0.2769 };

export const CHARACTER = {
  /** Hauteur du plan en unités monde (caméra à z=5, fov 35 → ~3,15 visibles). */
  height: 2.3,
  y: -0.42,
  /** Décalage horizontal en fraction de la largeur visible. */
  xFactor: 0.27,
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
