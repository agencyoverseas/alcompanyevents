"use client";

import { Check, X } from "lucide-react";
import { useEffect, useRef } from "react";
import { ACOMPTE_PERCENT, formatPrice, tiers, type Family } from "@/content/formules";
import { devisHref } from "@/content/devis";
import { ButtonLink } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

/**
 * Les trois niveaux d'une famille. <dialog> natif + showModal() : focus piégé,
 * Échap, retour du focus au déclencheur. Lenis neutralisé (data-lenis-prevent).
 */
export function FamilyModal({ family, onClose }: { family: Family | null; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (family && !d.open) {
      d.showModal();
      document.documentElement.style.overflow = "hidden";
    }
    if (!family && d.open) d.close();
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [family]);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => e.target === e.currentTarget && onClose()}
      data-lenis-prevent
      aria-labelledby="family-modal-title"
      className="m-auto max-h-[calc(100svh-2rem)] w-[min(760px,calc(100vw-2rem))] overflow-y-auto rounded-[34px] bg-white p-0 text-text backdrop:bg-ink/60 open:animate-[seq-fade-up_.4s_cubic-bezier(.22,1,.36,1)]"
    >
      {family && (
        <div className="p-6 sm:p-[34px]">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="smallcaps mb-2 text-terra-d">Formules</p>
              <h2 id="family-modal-title" className="h2-display text-ink">
                {family.name}
              </h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Fermer"
              className="grid size-10 shrink-0 place-items-center rounded-full bg-sky-50 text-ink hover:bg-sky-100"
            >
              <X className="size-5" aria-hidden />
            </button>
          </div>
          <p className="mt-2 text-muted">{family.short}</p>

          {tiers.map((t, i) => {
            const p = family.prices[t.id];
            const prev = tiers[i - 1];
            return (
              <div
                key={t.id}
                className={cn("mt-4 rounded-[20px] border p-5", t.popular ? "border-terra bg-[#FDF7F4]" : "border-line")}
              >
                <div className="flex flex-wrap items-baseline justify-between gap-3">
                  <h3 className="font-display text-xl font-semibold text-ink">
                    {t.name}
                    {t.popular && <span className="ml-2 text-sm font-medium text-terra-d">— le plus choisi</span>}
                  </h3>
                  <p>
                    {p !== null && <span className="smallcaps mr-1.5 text-muted">à partir de</span>}
                    <span className="font-display text-2xl font-black text-sky-800">{formatPrice(p)}</span>
                  </p>
                </div>
                <ul className="mb-4 mt-3 space-y-1.5 text-[0.88rem] text-muted">
                  {prev && (
                    <li className="flex gap-2">
                      <Check className="mt-0.5 size-4 shrink-0 text-sky-600" aria-hidden />
                      Tout le {prev.name}
                    </li>
                  )}
                  {t.includes.map((x) => (
                    <li key={x} className="flex gap-2">
                      <Check className="mt-0.5 size-4 shrink-0 text-sky-600" aria-hidden />
                      {x}
                    </li>
                  ))}
                </ul>
                <ButtonLink
                  href={devisHref(family.eventType, t.name)}
                  variant={t.popular ? "terra" : "outline"}
                  size="sm"
                >
                  Choisir {t.name}
                </ButtonLink>
              </div>
            );
          })}
          <p className="mt-5 text-[0.8rem] text-muted">
            Tous les prix sont « à partir de ». Acompte de {ACOMPTE_PERCENT} % à la réservation.
          </p>
        </div>
      )}
    </dialog>
  );
}
