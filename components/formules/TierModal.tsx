"use client";

import { Check, X } from "lucide-react";
import { useEffect, useRef } from "react";
import { ACOMPTE_PERCENT, formatPrice, tiers, type Family, type TierInfo } from "@/content/formules";
import { devisHref } from "@/content/devis";
import { ButtonLink } from "@/components/ui/Button";

/** Ce qu'inclut un palier, cumulé avec les paliers précédents. */
export function cumulativeIncludes(tier: TierInfo) {
  const idx = tiers.findIndex((t) => t.id === tier.id);
  return tiers.slice(0, idx + 1).map((t) => ({ tier: t, items: t.includes }));
}

/**
 * Détail d'un palier. <dialog> natif + showModal() : focus piégé, Échap,
 * retour du focus au déclencheur. Lenis est neutralisé via data-lenis-prevent.
 */
export function TierModal({
  family,
  tier,
  onClose,
}: {
  family: Family;
  tier: TierInfo | null;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (tier && !d.open) {
      d.showModal();
      document.documentElement.style.overflow = "hidden";
    }
    if (!tier && d.open) d.close();
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [tier]);

  const price = tier ? family.prices[tier.id] : null;

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => e.target === e.currentTarget && onClose()}
      data-lenis-prevent
      aria-labelledby="tier-modal-title"
      className="m-auto w-[min(560px,calc(100vw-2rem))] max-h-[calc(100svh-2rem)] overflow-y-auto rounded-[16px] border border-night-3 bg-night-2 p-0 text-light backdrop:bg-night/80 backdrop:backdrop-blur-sm open:animate-[seq-fade-up_.4s_cubic-bezier(.22,1,.36,1)]"
    >
      {tier && (
        <div className="p-6 sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="smallcaps text-gold-l">{family.name}</p>
              <h2 id="tier-modal-title" className="h2-display mt-2">
                Formule {tier.name}
              </h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Fermer"
              className="grid size-10 shrink-0 place-items-center rounded-[10px] text-muted-d hover:text-light"
            >
              <X className="size-5" aria-hidden />
            </button>
          </div>
          <p className="mt-2 text-muted-d">{tier.tagline}</p>
          <p className="mt-5">
            <span className="smallcaps block text-muted-d">{price === null ? "Tarif" : "À partir de"}</span>
            <span className="font-display text-4xl text-gold-l">{formatPrice(price)}</span>
          </p>

          <div className="mt-6 space-y-5">
            {cumulativeIncludes(tier).map(({ tier: t, items }) => (
              <div key={t.id}>
                <p className="smallcaps text-muted-d">{t.id === tier.id ? `Spécifique ${t.name}` : `Inclus de ${t.name}`}</p>
                <ul className="mt-2 space-y-2">
                  {items.map((it) => (
                    <li key={it} className="flex gap-3 text-sm">
                      <Check className="mt-0.5 size-4 shrink-0 text-gold-l" aria-hidden />
                      {it}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <p className="mt-6 rounded-[10px] border border-night-3 bg-night px-4 py-3 text-sm text-muted-d">
            Acompte de {ACOMPTE_PERCENT} % à la réservation. Le prix final dépend du nombre d&apos;invités, du lieu et
            des options.
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href={devisHref(family.eventType, tier.name)} size="lg" className="flex-1">
              Demander ce devis
            </ButtonLink>
            <button
              type="button"
              onClick={onClose}
              className="btn-label h-14 rounded-[10px] border border-night-3 px-6 text-light/80 hover:border-gold/60"
            >
              Comparer encore
            </button>
          </div>
        </div>
      )}
    </dialog>
  );
}
