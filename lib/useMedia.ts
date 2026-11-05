"use client";

import { useSyncExternalStore } from "react";

import { QUERIES } from "./queries";

export { QUERIES };

function subscribe(query: string) {
  return (cb: () => void) => {
    const mql = window.matchMedia(query);
    mql.addEventListener("change", cb);
    return () => mql.removeEventListener("change", cb);
  };
}

/**
 * Renvoie false côté serveur et pendant l'hydratation : le rendu initial est
 * toujours la version mobile / statique, la version enrichie arrive ensuite.
 */
export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    subscribe(query),
    () => window.matchMedia(query).matches,
    () => false,
  );
}

export const useCanScene = () => useMediaQuery(QUERIES.scene);
export const useCanLenis = () => useMediaQuery(QUERIES.lenis);
export const useCanPin = () => useMediaQuery(QUERIES.pin);
export const useCanCursor = () => useMediaQuery(QUERIES.cursor);
export const usePrefersReducedMotion = () => useMediaQuery(QUERIES.reducedMotion);
export const usePointerFine = () => useMediaQuery(QUERIES.pointerFine);
