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
          <h3 id={`${family.id}-title`} className="font-display text-3xl font-semibold text-ink sm:text-4xl">
            {family.name}
          </h3>
          <p className="text-sm text-muted">{family.short}</p>
        </header>

        <ul className="grid gap-3 md:grid-cols-3 md:gap-4">
          {tiers.map((t) => {
            const price = family.prices[t.id];
            return (
              <li
                key={t.id}
                className={cn(
                  "relative flex flex-col rounded-[20px] border p-5 sm:p-6",
                  t.popular ? "border-terra bg-[#FDF7F4]" : "border-line bg-white",
                )}
              >
                {t.popular && (
                  <span className="smallcaps absolute -top-2.5 left-5 rounded-full bg-terra-d px-2.5 py-1 text-white">
                    Le plus choisi
                  </span>
                )}
                <div className="flex items-baseline justify-between gap-3">
                  <h4 className="font-display text-2xl font-semibold text-ink">{t.name}</h4>
                  <p className="text-right">
                    {price !== null && <span className="smallcaps mr-1.5 text-muted">dès</span>}
                    <span className="font-display text-2xl font-black text-sky-800">{formatPrice(price)}</span>
                  </p>
                </div>
                <p className="mt-2 flex-1 text-sm text-muted">{t.tagline}</p>
                <div className="mt-5 flex items-center gap-2">
                  <TransitionLink
                    href={devisHref(family.eventType, t.name)}
                    className={cn(
                      "btn-label inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-full transition-opacity",
                      t.popular ? "bg-terra-d text-white hover:brightness-110" : "border border-sky-200 text-ink hover:bg-sky-50",
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
                    className="grid size-11 place-items-center rounded-full border border-line text-muted transition-colors hover:border-terra/60 hover:text-terra-d"
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
