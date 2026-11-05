"use client";

import { LazyMotion, MotionConfig, domAnimation } from "motion/react";

/** LazyMotion + `m` : on ne charge que le moteur DOM (bundle mobile plus léger). */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  );
}
