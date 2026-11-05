"use client";

import { AnimatePresence, m } from "motion/react";
import { Check, ChevronDown, MessageCircle, Phone } from "lucide-react";
import { useId, useState } from "react";
import { ACOMPTE_PERCENT, formatPrice, tiers, type Family, type TierInfo } from "@/content/formules";
import { devisHref } from "@/content/devis";
import { site, telHref } from "@/content/site";
import { ButtonLink } from "@/components/ui/Button";
import { EASE_OUT } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * Carte d'un palier. « Choisir » ouvre un panneau déroulant qui détaille la prestation ;
 * depuis ce panneau, la personne peut demander un devis (formulaire pré-rempli),
 * appeler ou écrire sur WhatsApp. Le formulaire n'est jamais imposé.
 */
export function TierCard({ family, tier }: { family: Family; tier: TierInfo }) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const price = family.prices[tier.id];
  const idx = tiers.findIndex((t) => t.id === tier.id);
  const included = tiers.slice(0, idx + 1);
  const whatsappText = encodeURIComponent(
    `Bonjour Audrey, la formule ${tier.name} (${family.name}) m'intéresse. Pouvez-vous m'en dire plus ?`,
  );

  return (
    <div
      className={cn(
        "relative flex flex-col rounded-[20px] border p-5 sm:p-6",
        tier.popular ? "border-terra bg-[#FDF7F4]" : "border-line bg-white",
      )}
    >
      {tier.popular && (
        <span className="smallcaps absolute -top-2.5 left-5 rounded-full bg-terra-d px-2.5 py-1 text-white">
          Le plus choisi
        </span>
      )}
      <div className="flex items-baseline justify-between gap-3">
        <h4 className="font-display text-2xl font-semibold text-ink">{tier.name}</h4>
        <p className="text-right">
          {price !== null && <span className="smallcaps mr-1.5 text-muted">dès</span>}
          <span className="font-display text-2xl font-black text-sky-800">{formatPrice(price)}</span>
        </p>
      </div>
      <p className="mt-2 text-sm text-muted">{tier.tagline}</p>

      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls={panelId}
        className={cn(
          "btn-label mt-5 inline-flex h-11 items-center justify-center gap-2 rounded-full transition-[background-color,filter]",
          tier.popular ? "bg-terra-d text-white hover:brightness-110" : "border border-sky-200 text-ink hover:bg-sky-50",
        )}
      >
        {open ? "Masquer le détail" : "Choisir"}
        <ChevronDown className={cn("size-4 transition-transform duration-300", open && "rotate-180")} aria-hidden />
        <span className="sr-only">
          {" "}
          — formule {tier.name}, {family.name}
        </span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <m.div
            id={panelId}
            key="panel"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: EASE_OUT }}
            className="overflow-hidden"
          >
            <div className="mt-5 border-t border-line pt-5">
              <p className="smallcaps text-terra-d">Ce que comprend la formule</p>
              {included.map((t) => (
                <ul key={t.id} className="mt-3 space-y-1.5 text-[0.88rem] text-text">
                  {t.includes.map((x) => (
                    <li key={x} className="flex gap-2">
                      <Check className="mt-0.5 size-4 shrink-0 text-sky-600" aria-hidden />
                      {x}
                    </li>
                  ))}
                </ul>
              ))}
              <p className="mt-4 rounded-[12px] bg-sky-50 px-4 py-3 text-[0.8rem] text-muted">
                Prix « à partir de » : il dépend du nombre d&apos;invités, du lieu et des options. Réservation
                confirmée par un acompte de {ACOMPTE_PERCENT} %.
              </p>
              <div className="mt-4 flex flex-col gap-2">
                <ButtonLink
                  href={devisHref(family.eventType, tier.name)}
                  variant={tier.popular ? "terra" : "primary"}
                  size="sm"
                >
                  Je demande mon devis
                </ButtonLink>
                <div className="grid grid-cols-2 gap-2">
                  <ButtonLink href={telHref} variant="outline" size="sm">
                    <Phone className="size-3.5" aria-hidden /> Appeler
                  </ButtonLink>
                  <a
                    href={`${site.whatsapp}?text=${whatsappText}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-label inline-flex h-10 items-center justify-center gap-1.5 rounded-full border border-sky-200 text-[0.82rem] text-ink hover:bg-sky-50"
                  >
                    <MessageCircle className="size-3.5" aria-hidden /> WhatsApp
                    <span className="sr-only"> (nouvel onglet)</span>
                  </a>
                </div>
              </div>
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
}
