"use client";

import { useEffect, useRef, type RefObject } from "react";
import { gsap, rescrollToHash, SCROLL, useGSAP, type ScrollTrigger } from "@/lib/gsap";

/** Pin + scrub du rail horizontal (bureau uniquement, chargé en dynamique). */
export default function RailPin({
  sectionRef,
  trackRef,
  viewportRef,
}: {
  sectionRef: RefObject<HTMLElement | null>;
  trackRef: RefObject<HTMLUListElement | null>;
  viewportRef: RefObject<HTMLDivElement | null>;
}) {
  const st = useRef<ScrollTrigger | null>(null);

  useGSAP(
    () => {
      const track = trackRef.current;
      if (!track) return;
      const distance = () => Math.max(0, track.scrollWidth - window.innerWidth);
      const tween = gsap.to(track, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: () => `+=${distance()}`,
          pin: true,
          scrub: SCROLL.rail.scrub,
          invalidateOnRefresh: true,
        },
      });
      st.current = tween.scrollTrigger ?? null;
      rescrollToHash();
    },
    { scope: sectionRef },
  );

  // Clavier : une carte reçoit le focus hors champ → on défile la page jusqu'à elle.
  useEffect(() => {
    const track = trackRef.current;
    const viewport = viewportRef.current;
    if (!track || !viewport) return;
    const onFocus = (e: FocusEvent) => {
      const li = (e.target as Element).closest("li");
      const trigger = st.current;
      if (!li || !trigger) return;
      viewport.scrollLeft = 0; // le navigateur a pu décaler le conteneur
      const max = Math.max(0, track.scrollWidth - window.innerWidth);
      const target = Math.min(max, Math.max(0, li.offsetLeft - window.innerWidth * 0.2));
      window.scrollTo({ top: trigger.start + target, behavior: "instant" });
    };
    track.addEventListener("focusin", onFocus);
    return () => track.removeEventListener("focusin", onFocus);
  }, [trackRef, viewportRef]);

  return null;
}
