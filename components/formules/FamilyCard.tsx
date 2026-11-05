"use client";

import { ArrowRight, Info } from "lucide-react";
import { useState } from "react";
import { formatPrice, tiers, type Family, type TierInfo } from "@/content/formules";
import { devisHref } from "@/content/devis";
import { TransitionLink } from "@/components/layout/PageTransition";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";
import { TierModal } from "./TierModal";

/** Une famille d'événements en trois paliers. Signature mis en avant. */
export function FamilyCard({ family }: { family: Family }) {
  const [open, setOpen] = useState<TierInfo | null>(null);
  return (
    <Reveal>
      <article id={family.id} aria-labelledby={`${family.id}-title`} className="scroll-mt-28">
        <header className="mb-5 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <h3 id={`${family.id}-title`} className="font-display text-3xl text-light sm:text-4xl">
            {family.name}
          </h3>
          <p className="text-sm text-muted-d">{family.short}</p>
        </header>

        <ul className="grid gap-3 md:grid-cols-3 md:gap-4">
          {tiers.map((t) => {
            const price = family.prices[t.id];
            return (
              <li
                key={t.id}
                className={cn(
                  "relative flex flex-col rounded-[10px] border p-5 sm:p-6",
                  t.popular ? "border-gold/70 bg-night-2 shadow-[0_0_0_1px_rgba(201,162,91,.25)]" : "border-night-3 bg-night-2/60",
                )}
              >
                {t.popular && (
                  <span className="smallcaps absolute -top-2.5 left-5 rounded-[6px] bg-gold px-2.5 py-1 text-ink">
                    Le plus choisi
                  </span>
                )}
                <div className="flex items-baseline justify-between gap-3">
                  <h4 className="font-display text-2xl text-light">{t.name}</h4>
                  <p className="text-right">
                    {price !== null && <span className="smallcaps mr-1.5 text-muted-d">dès</span>}
                    <span className="font-display text-2xl text-gold-l">{formatPrice(price)}</span>
                  </p>
                </div>
                <p className="mt-2 flex-1 text-sm text-muted-d">{t.tagline}</p>
                <div className="mt-5 flex items-center gap-2">
                  <TransitionLink
                    href={devisHref(family.eventType, t.name)}
                    className={cn(
                      "btn-label inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-[10px] transition-opacity",
                      t.popular ? "bg-gold-gradient text-ink hover:opacity-90" : "border border-gold/60 text-gold-l hover:bg-gold/10",
                    )}
                  >
                    Choisir <ArrowRight className="size-4" aria-hidden />
                    <span className="sr-only">
                      {" "}
                      la formule {t.name} — {family.name}
                    </span>
                  </TransitionLink>
                  <button
                    type="button"
                    onClick={() => setOpen(t)}
                    className="grid size-11 place-items-center rounded-[10px] border border-night-3 text-muted-d transition-colors hover:border-gold/60 hover:text-gold-l"
                    aria-label={`Détails de la formule ${t.name} — ${family.name}`}
                    aria-haspopup="dialog"
                  >
                    <Info className="size-4" aria-hidden />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
        <TierModal family={family} tier={open} onClose={() => setOpen(null)} />
      </article>
    </Reveal>
  );
}
