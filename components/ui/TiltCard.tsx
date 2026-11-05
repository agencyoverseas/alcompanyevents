"use client";

import { m, useMotionValue, useSpring, useTransform } from "motion/react";
import type { PointerEvent, ReactNode } from "react";
import { tilt } from "@/lib/motion";
import { useCanCursor } from "@/lib/useMedia";
import { cn } from "@/lib/utils";

/**
 * Carte inclinée selon la position du curseur (max 7°, perspective 900px).
 * `layer` est rendu dans un plan qui ressort de 22px en translateZ.
 * Désactivé sur pointeur tactile et en mouvement réduit.
 */
export function TiltCard({
  children,
  layer,
  className,
}: {
  children?: ReactNode;
  layer: ReactNode;
  className?: string;
}) {
  const enabled = useCanCursor();
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const rx = useSpring(useTransform(py, [-0.5, 0.5], [tilt.maxDeg, -tilt.maxDeg]), tilt.spring);
  const ry = useSpring(useTransform(px, [-0.5, 0.5], [-tilt.maxDeg, tilt.maxDeg]), tilt.spring);
  const z = useSpring(0, tilt.spring);

  function onMove(e: PointerEvent<HTMLDivElement>) {
    if (!enabled) return;
    const r = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width - 0.5);
    py.set((e.clientY - r.top) / r.height - 0.5);
  }
  function onEnter() {
    if (enabled) z.set(tilt.liftZ);
  }
  function onLeave() {
    px.set(0);
    py.set(0);
    z.set(0);
  }

  return (
    <div style={{ perspective: tilt.perspective }} className={cn("h-full", className)}>
      <m.div
        onPointerMove={onMove}
        onPointerEnter={onEnter}
        onPointerLeave={onLeave}
        style={enabled ? { rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" } : undefined}
        className="relative h-full"
      >
        <m.div style={enabled ? { z } : undefined} className="absolute inset-0">
          {layer}
        </m.div>
        {children}
      </m.div>
    </div>
  );
}
