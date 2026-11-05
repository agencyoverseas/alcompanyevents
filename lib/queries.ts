// Module neutre (ni client ni serveur) : importable depuis app/layout.tsx.
/**
 * Requêtes de référence. Elles sont réutilisées par le script inline de
 * app/layout.tsx (SCENE_QUERY) : garder les deux synchronisés.
 */
export const QUERIES = {
  /** WebGL autorisé : ≥ 768px, souris/trackpad, mouvement non réduit. */
  scene: "(min-width: 768px) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
  /** Lenis : souris/trackpad et largeur > 1024px. */
  lenis: "(min-width: 1025px) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
  /** Pins et scroll horizontal : ≥ 768px et mouvement non réduit. */
  pin: "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
  /** Curseur personnalisé. */
  cursor: "(pointer: fine) and (prefers-reduced-motion: no-preference)",
  reducedMotion: "(prefers-reduced-motion: reduce)",
  pointerFine: "(pointer: fine)",
} as const;
