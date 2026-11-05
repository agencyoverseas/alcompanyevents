"use client";

import { m, useReducedMotion } from "motion/react";
import type { ComponentProps } from "react";
import { fadeUp, reducedFade, viewportOnce } from "@/lib/motion";

/** Révélation au scroll (Motion). */
export function Reveal({
  delay = 0,
  ...props
}: ComponentProps<typeof m.div> & { delay?: number }) {
  const reduced = useReducedMotion();
  return (
    <m.div
      variants={reduced ? reducedFade : fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={viewportOnce}
      transition={delay ? { delay } : undefined}
      {...props}
    />
  );
}
