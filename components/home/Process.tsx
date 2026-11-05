"use client";

import { m, useReducedMotion } from "motion/react";
import { process } from "@/content/process";
import { Section } from "@/components/ui/Section";
import { fadeUp, processStagger, reducedFade, viewportOnce } from "@/lib/motion";

/** Déroulé en quatre étapes, révélées au scroll à 320 ms d'écart. */
export function Process() {
  const reduced = useReducedMotion();
  const item = reduced ? reducedFade : fadeUp;
  return (
    <Section
      id="deroule"
      eyebrow="Le déroulé"
      title={
        <>
          De la première idée <em className="text-gold-l">au démontage</em>
        </>
      }
    >
      <m.ol
        variants={processStagger}
        initial="hidden"
        whileInView="show"
        viewport={viewportOnce}
        className="relative grid gap-10 md:grid-cols-4 md:gap-6"
      >
        {/* Pointillés reliant les étapes */}
        <li
          aria-hidden
          className="pointer-events-none absolute left-[1.35rem] top-6 bottom-6 border-l border-dashed border-gold/50 md:left-6 md:right-6 md:top-[1.7rem] md:bottom-auto md:border-l-0 md:border-t"
        />
        {process.map((s) => (
          <m.li key={s.n} variants={item} className="relative pl-14 md:pl-0">
            <span className="absolute left-0 top-0 grid size-11 place-items-center rounded-full border border-gold/60 bg-night font-display text-xl text-gold-l md:static md:size-14 md:text-2xl">
              {s.n}
            </span>
            <h3 className="font-display text-2xl text-light md:mt-6">{s.title}</h3>
            <p className="mt-2 text-sm text-muted-d">{s.text}</p>
          </m.li>
        ))}
      </m.ol>
    </Section>
  );
}
