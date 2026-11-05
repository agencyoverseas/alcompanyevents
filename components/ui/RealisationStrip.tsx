import { MapPin } from "lucide-react";
import { placeLabel } from "@/content/realisations";
import type { Realisation } from "@/content/types";
import { Photo } from "./Photo";

export function RealisationStrip({ items }: { items: Realisation[] }) {
  return (
    <ul className="grid gap-[18px] sm:grid-cols-2 lg:grid-cols-3">
      {items.map((r) => (
        <li key={r.id}>
          <figure>
            <Photo src={r.src} alt={r.alt} sizes="(max-width: 639px) 92vw, 360px" className="aspect-[400/516] rounded-[20px]" />
            <figcaption className="mt-3">
              <span className="block font-display text-lg font-semibold text-ink">{r.title}</span>
              <span className="mt-0.5 inline-flex items-center gap-1.5 text-sm text-muted">
                <MapPin className="size-3.5" aria-hidden /> {placeLabel(r)}
              </span>
            </figcaption>
          </figure>
        </li>
      ))}
    </ul>
  );
}
