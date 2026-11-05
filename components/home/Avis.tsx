import { Star } from "lucide-react";
import { avis } from "@/content/avis";
import { Card } from "@/components/ui/Card";
import { Section } from "@/components/ui/Section";
import { Stagger, StaggerItem } from "@/components/ui/Stagger";
import { cn } from "@/lib/utils";

export function Avis() {
  return (
    <Section
      id="avis"
      eyebrow="Avis clients"
      title={
        <>
          Elles en <em className="text-gold-l">parlent mieux</em> que nous
        </>
      }
    >
      <Stagger className="grid gap-4 md:grid-cols-3 md:gap-6">
        {avis.map((a) => (
          <StaggerItem key={a.id}>
            <Card className="flex h-full flex-col p-6 sm:p-8">
              <div className="flex gap-1 text-gold" role="img" aria-label={`${a.rating} étoiles sur 5`}>
                {Array.from({ length: 5 }, (_, i) => (
                  <Star key={i} className={cn("size-4", i < a.rating ? "fill-gold" : "opacity-30")} aria-hidden />
                ))}
              </div>
              <blockquote
                className={cn(
                  "mt-5 flex-1 font-display text-2xl leading-snug",
                  a.placeholder ? "italic text-muted-d" : "text-light",
                )}
              >
                « {a.quote} »
              </blockquote>
              <p className="mt-6 text-sm">
                <span className="font-semibold text-light">{a.author}</span>
                <span className="text-muted-d"> — {a.event}</span>
              </p>
            </Card>
          </StaggerItem>
        ))}
      </Stagger>
    </Section>
  );
}
