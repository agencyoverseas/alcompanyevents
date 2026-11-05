"use client";

import { m, useReducedMotion, type Variants } from "motion/react";
import type { ComponentProps } from "react";
import { fadeUp, reducedFade, stagger, viewportOnce } from "@/lib/motion";

export function Stagger({
  step = 0.08,
  variants,
  ...props
}: ComponentProps<typeof m.div> & { step?: number; variants?: Variants }) {
  return (
    <m.div
      variants={variants ?? stagger(step)}
      initial="hidden"
      whileInView="show"
      viewport={viewportOnce}
      {...props}
    />
  );
}

export function StaggerItem(props: ComponentProps<typeof m.div>) {
  const reduced = useReducedMotion();
  return <m.div variants={reduced ? reducedFade : fadeUp} {...props} />;
}
