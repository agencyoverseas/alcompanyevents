"use client";

import { ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import { useRef } from "react";
import { placeLabel } from "@/content/realisations";
import type { Realisation } from "@/content/types";
import { Photo } from "@/components/ui/Photo";
import { gsap, useGSAP } from "@/lib/gsap";

const CARD_W = 220; // px — sous la taille native (400px) des photos
const GAP = 34;

/**
 * Carrousel en anneau (bureau). Photos disposées en cercle, anneau incliné pour
 * dessiner un arc. Rotation = scroll (ScrollTrigger) + glissement (inertie) +
 * boutons précédent/suivant (clavier). Tout passe par GSAP sur un seul élément.
 */
export default function RingCarousel({ items }: { items: Realisation[] }) {
  const scope = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const api = useRef<{ step: (dir: 1 | -1) => void } | null>(null);

  const n = items.length;
  const angle = 360 / n;
  const radius = Math.round((n * (CARD_W + GAP)) / (2 * Math.PI));

  useGSAP(
    () => {
      const el = ring.current!;
      const state = { scroll: 0, drag: 0 };
      const setRot = gsap.quickSetter(el, "rotationY", "deg");
      const render = () => setRot(-(state.scroll + state.drag));
      render();

      gsap.to(state, {
        scroll: 140,
        ease: "none",
        onUpdate: render,
        scrollTrigger: { trigger: scope.current, start: "top top", end: "bottom top", scrub: 0.8 },
      });

      let startX = 0;
      let startDrag = 0;
      let lastX = 0;
      let lastT = 0;
      let velocity = 0;
      const onDown = (e: PointerEvent) => {
        gsap.killTweensOf(state, "drag");
        startX = lastX = e.clientX;
        lastT = performance.now();
        startDrag = state.drag;
        el.setPointerCapture(e.pointerId);
        el.addEventListener("pointermove", onMove);
      };
      const onMove = (e: PointerEvent) => {
        const now = performance.now();
        velocity = (e.clientX - lastX) / Math.max(1, now - lastT);
        lastX = e.clientX;
        lastT = now;
        state.drag = startDrag - (e.clientX - startX) * 0.25;
        render();
      };
      const onUp = (e: PointerEvent) => {
        el.removeEventListener("pointermove", onMove);
        if (el.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId);
        // Inertie, puis on se cale sur la carte la plus proche.
        const target = state.drag - velocity * 45;
        const total = state.scroll + target;
        const snapped = Math.round(total / angle) * angle - state.scroll;
        gsap.to(state, { drag: snapped, duration: 1.1, ease: "power3.out", onUpdate: render });
      };
      el.addEventListener("pointerdown", onDown);
      el.addEventListener("pointerup", onUp);
      el.addEventListener("pointercancel", onUp);

      api.current = {
        step: (dir) => {
          const total = state.scroll + state.drag;
          const next = (Math.round(total / angle) + dir) * angle - state.scroll;
          gsap.to(state, { drag: next, duration: 0.8, ease: "power3.inOut", onUpdate: render });
        },
      };

      return () => {
        el.removeEventListener("pointerdown", onDown);
        el.removeEventListener("pointerup", onUp);
        el.removeEventListener("pointercancel", onUp);
        el.removeEventListener("pointermove", onMove);
      };
    },
    { scope },
  );

  return (
    <div ref={scope} className="relative">
      <div
        className="relative mx-auto h-[440px] select-none"
        style={{ perspective: 1500, perspectiveOrigin: "50% 30%" }}
      >
        <div className="absolute inset-0" style={{ transform: "rotateX(-7deg)", transformStyle: "preserve-3d" }}>
          <div
            ref={ring}
            data-cursor="view"
            className="absolute left-1/2 top-6 cursor-grab touch-pan-y active:cursor-grabbing"
            style={{ width: CARD_W, height: (CARD_W * 516) / 400, marginLeft: -CARD_W / 2, transformStyle: "preserve-3d" }}
          >
            {items.map((r, i) => (
              <figure
                key={r.id}
                className="absolute inset-0 [backface-visibility:hidden]"
                style={{ transform: `rotateY(${i * angle}deg) translateZ(${radius}px)` }}
              >
                <Photo src={r.src} alt={r.alt} sizes={`${CARD_W}px`} className="h-full rounded-[10px]" />
                <figcaption className="mt-3 text-center">
                  <span className="block font-display text-lg leading-tight text-light">{r.title}</span>
                  <span className="mt-0.5 inline-flex items-center gap-1 text-xs text-muted-d">
                    <MapPin className="size-3" aria-hidden /> {placeLabel(r)}
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </div>
      <div className="relative z-10 mt-2 flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => api.current?.step(-1)}
          aria-label="Photo précédente"
          className="grid size-11 place-items-center rounded-[10px] border border-night-3 text-light/80 hover:border-gold/60 hover:text-gold-l"
        >
          <ChevronLeft className="size-5" aria-hidden />
        </button>
        <span className="smallcaps text-muted-d">Glissez ou défilez</span>
        <button
          type="button"
          onClick={() => api.current?.step(1)}
          aria-label="Photo suivante"
          className="grid size-11 place-items-center rounded-[10px] border border-night-3 text-light/80 hover:border-gold/60 hover:text-gold-l"
        >
          <ChevronRight className="size-5" aria-hidden />
        </button>
      </div>
    </div>
  );
}
