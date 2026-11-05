"use client";

import { useState } from "react";
import { families, formatPrice, type Family } from "@/content/formules";
import { Photo } from "@/components/ui/Photo";
import { Stagger, StaggerItem } from "@/components/ui/Stagger";
import { FamilyModal } from "./FamilyModal";

/** Les quatre familles : photo, prix « à partir de », ouverture des 3 niveaux. */
export function FamilyGrid() {
  const [open, setOpen] = useState<Family | null>(null);
  return (
    <>
      <Stagger className="grid gap-[18px] sm:grid-cols-2 lg:grid-cols-4">
        {families.map((f) => (
          <StaggerItem key={f.id} className="h-full">
            <button
              type="button"
              onClick={() => setOpen(f)}
              aria-haspopup="dialog"
              data-cursor="view"
              className="group relative flex h-full w-full flex-col rounded-[20px] border border-line bg-white p-[22px] text-left transition-[transform,border-color] duration-200 hover:-translate-y-[3px] hover:border-sky-400"
            >
              {f.tag && (
                <span className="absolute right-4 top-4 z-10 rounded-full bg-terra-d px-[11px] py-1 text-[0.66rem] font-medium text-white">
                  {f.tag}
                </span>
              )}
              <Photo
                src={f.photo}
                alt={f.alt}
                sizes="(max-width: 639px) 92vw, (max-width: 1023px) 45vw, 260px"
                className="mb-4 h-[160px] rounded-[12px]"
                imgClassName="transition-transform duration-500 group-hover:scale-[1.04]"
              />
              <h3 className="font-display text-[1.18rem] font-semibold text-ink">{f.name}</h3>
              <p className="mt-1.5 flex-1 text-[0.9rem] text-muted">{f.short}</p>
              <p className="mt-3 font-display text-[1.75rem] font-black text-sky-800">{formatPrice(f.prices.essentiel)}</p>
              <p className="smallcaps text-muted">à partir de · 3 formules</p>
            </button>
          </StaggerItem>
        ))}
      </Stagger>
      <FamilyModal family={open} onClose={() => setOpen(null)} />
    </>
  );
}
