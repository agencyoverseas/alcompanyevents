"use client";

import dynamic from "next/dynamic";
import { useCanLenis } from "@/lib/useMedia";

// Lenis + GSAP ne sont téléchargés que si la requête « lenis » est vraie
// (pointeur fin, > 1024px, mouvement non réduit). Jamais sur mobile.
const LenisRunner = dynamic(() => import("./LenisRunner"), { ssr: false });

export function SmoothScroll() {
  return useCanLenis() ? <LenisRunner /> : null;
}
