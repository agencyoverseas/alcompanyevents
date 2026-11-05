"use client";

import { AnimatePresence, m } from "motion/react";
import { usePathname } from "next/navigation";
import { navState } from "@/components/layout/PageTransition";
import { PAGE_TRANSITION } from "@/lib/motion";
import { usePrefersReducedMotion } from "@/lib/useMedia";

/**
 * Remonté à chaque navigation. Le ballon terracotta (PageTransitionProvider) couvre
 * le changement de route ; ici on gère l'entrée de la page :
 * - mouvement réduit : fondu de 200 ms (pas de ballon) ;
 * - sinon : la page est déjà sous le ballon, elle apparaît telle quelle.
 * Première visite : aucune animation (le contenu SSR reste visible sans JS).
 * N'anime que l'opacité : un transform casserait les pins GSAP (position: fixed).
 */
export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const reduced = usePrefersReducedMotion();
  const animateIn = navState.navigated && reduced;
  return (
    <AnimatePresence mode="wait" initial={animateIn}>
      <m.div
        key={pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: PAGE_TRANSITION.reducedFadeMs / 1000 }}
      >
        {children}
      </m.div>
    </AnimatePresence>
  );
}
