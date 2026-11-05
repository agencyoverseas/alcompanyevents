"use client";

import { m, useReducedMotion } from "motion/react";
import { process, PROCESS_TITLE } from "@/content/process";
import { Section } from "@/components/ui/Section";
import { fadeUp, processStagger, reducedFade, viewportOnce } from "@/lib/motion";

/** « Comment ça se passe ? » — 4 étapes, textes de la cliente, révélées à 320 ms d'écart. */
export function Process({ eyebrow = "Comment ça se passe ?", tone = "paper" }: { eyebrow?: string; tone?: "paper" | "sand" }) {
  const reduced = useReducedMotion();
  const item = reduced ? reducedFade : fadeUp;
  return (
    <Section id="deroule" tone={tone} eyebrow={eyebrow} title={PROCESS_TITLE}>
      <m.ol
        variants={processStagger}
        initial="hidden"
        whileInView="show"
        viewport={viewportOnce}
        className="relative grid gap-4 md:grid-cols-2 lg:grid-cols-4 lg:gap-[2px]"
      >
        {process.map((s, i) => (
          <m.li
            key={s.n}
            variants={item}
            className="relative flex flex-col border border-line bg-white p-6 max-lg:rounded-[20px] lg:first:rounded-l-[20px] lg:last:rounded-r-[20px]"
          >
            <div className="flex items-center gap-3">
              <span className="font-display text-[2.6rem] font-black leading-none text-terra-d">{s.n}</span>
              {i < process.length - 1 && (
                <span aria-hidden className="hidden h-px flex-1 border-t border-dashed border-terra/50 lg:block" />
              )}
            </div>
            <h3 className="mt-4 font-display text-[1.18rem] font-semibold text-ink">{s.title}</h3>
            <p className="mt-2 text-[0.88rem] leading-relaxed text-muted">{s.text}</p>
          </m.li>
        ))}
      </m.ol>
    </Section>
  );
}
