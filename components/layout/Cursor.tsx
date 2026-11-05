"use client";

import { useEffect, useRef } from "react";
import { useCanCursor } from "@/lib/useMedia";

const RING = 42; // px
const SCALE = { idle: 1, link: 62 / RING, view: 86 / RING } as const;
const LERP_RING = 0.13;
const LERP_DOT = 0.42;

type Mode = keyof typeof SCALE;

/**
 * Curseur personnalisé — uniquement sur pointeur fin et mouvement non réduit.
 * Anneau doré 42px (inertie 0,13) + point terracotta 5px (0,42).
 * Liens/boutons → 62px translucide. Photos / scène (data-cursor="view") → 86px doré + « Voir ».
 * Tout passe par transform/opacity.
 */
export function Cursor() {
  const enabled = useCanCursor();
  return enabled ? <CursorInner /> : null;
}

function CursorInner() {
  const ring = useRef<HTMLDivElement>(null);
  const fill = useRef<HTMLDivElement>(null);
  const dot = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("has-cursor");
    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const r = { ...target };
    const d = { ...target };
    let scale = 1;
    let mode: Mode = "idle";
    let visible = false;
    let raf = 0;

    const setVisible = (v: boolean) => {
      visible = v;
      const o = v ? "1" : "0";
      if (ring.current) ring.current.style.opacity = o;
      if (dot.current) dot.current.style.opacity = o;
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" && e.pointerType !== "pen") return;
      target.x = e.clientX;
      target.y = e.clientY;
      if (!visible) {
        r.x = d.x = e.clientX;
        r.y = d.y = e.clientY;
        setVisible(true);
      }
    };
    const onOver = (e: Event) => {
      const el = e.target as Element | null;
      const next: Mode = el?.closest('[data-cursor="view"]')
        ? "view"
        : el?.closest('a, button, [role="button"], input, select, textarea, label, summary')
          ? "link"
          : "idle";
      if (next === mode) return;
      mode = next;
      fill.current?.setAttribute("data-mode", mode);
      if (label.current) label.current.style.opacity = mode === "view" ? "1" : "0";
    };
    const onLeave = () => setVisible(false);

    const loop = () => {
      r.x += (target.x - r.x) * LERP_RING;
      r.y += (target.y - r.y) * LERP_RING;
      d.x += (target.x - d.x) * LERP_DOT;
      d.y += (target.y - d.y) * LERP_DOT;
      scale += (SCALE[mode] - scale) * 0.18;
      if (ring.current)
        ring.current.style.transform = `translate3d(${r.x - RING / 2}px, ${r.y - RING / 2}px, 0)`;
      if (fill.current) fill.current.style.transform = `scale(${scale})`;
      if (dot.current) dot.current.style.transform = `translate3d(${d.x - 2.5}px, ${d.y - 2.5}px, 0)`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerover", onOver, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      root.classList.remove("has-cursor");
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[100]">
      <div
        ref={ring}
        className="absolute left-0 top-0 opacity-0 transition-opacity duration-300 will-change-transform"
        style={{ width: RING, height: RING }}
      >
        <div
          ref={fill}
          data-mode="idle"
          className="absolute inset-0 rounded-full border border-gold transition-[background-color,border-color] duration-300 data-[mode=link]:bg-gold/15 data-[mode=view]:border-transparent data-[mode=view]:bg-gold"
        />
        <span
          ref={label}
          className="smallcaps absolute inset-0 grid place-items-center text-ink opacity-0 transition-opacity duration-200"
        >
          Voir
        </span>
      </div>
      <div
        ref={dot}
        className="absolute left-0 top-0 size-[5px] rounded-full bg-terracotta opacity-0 will-change-transform"
      />
    </div>
  );
}
