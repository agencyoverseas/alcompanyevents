import { Star } from "lucide-react";
import Image from "next/image";
import { avis } from "@/content/avis";
import { Section } from "@/components/ui/Section";
import { Stagger, StaggerItem } from "@/components/ui/Stagger";
import { cn } from "@/lib/utils";

/** « Ils parlent de leur expérience » : prénom, type d'événement, photo de la réalisation. */
export function Avis({ tone = "sand" }: { tone?: "sand" | "paper" }) {
  // Aucun avis fourni : on n'affiche pas de section vide (aucun témoignage inventé).
  if (avis.length === 0) return null;
  return (
    <Section
      id="avis"
      tone={tone}
      eyebrow="Avis clients"
      title={
        <>
          Ils parlent de <em>leur expérience</em>
        </>
      }
    >
      <Stagger className="grid gap-[18px] md:grid-cols-3">
        {avis.map((a) => (
          <StaggerItem key={a.id}>
            <figure className="flex h-full flex-col overflow-hidden rounded-[20px] border border-line bg-white">
              {a.photo && (
                <div className="relative aspect-[4/3]">
                  <Image
                    src={a.photo}
                    alt={a.photoAlt ?? ""}
                    fill
                    sizes="(max-width: 767px) 92vw, 360px"
                    className="object-cover"
                  />
                </div>
              )}
              <div className="flex flex-1 flex-col p-6">
                {a.rating && (
                  <div
                    className="flex gap-1 text-terra"
                    role="img"
                    aria-label={`${a.rating} étoiles sur 5`}
                  >
                    {Array.from({ length: 5 }, (_, i) => (
                      <Star
                        key={i}
                        className={cn(
                          "size-4",
                          i < (a.rating ?? 0) ? "fill-terra" : "opacity-30",
                        )}
                        aria-hidden
                      />
                    ))}
                  </div>
                )}
                <blockquote className="mt-3 flex-1 font-display text-[1.05rem] font-light text-ink">
                  « {a.quote} »
                </blockquote>
                <figcaption className="mt-4 text-[0.8rem] text-muted">
                  <b className="font-semibold text-ink">{a.prenom}</b> —{" "}
                  {a.event}
                </figcaption>
              </div>
            </figure>
          </StaggerItem>
        ))}
      </Stagger>
    </Section>
  );
}
