import { tiers, type Family } from "@/content/formules";
import { Reveal } from "@/components/ui/Reveal";
import { TierCard } from "./TierCard";

/** Une famille d'événements en trois paliers. Signature mis en avant. */
export function FamilyCard({ family }: { family: Family }) {
  return (
    <Reveal>
      <article id={family.id} aria-labelledby={`${family.id}-title`} className="scroll-mt-28">
        <header className="mb-5 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <h3 id={`${family.id}-title`} className="font-display text-3xl font-semibold text-ink sm:text-4xl">
            {family.name}
          </h3>
          <p className="text-sm text-muted">{family.short}</p>
        </header>
        <ul className="grid items-start gap-3 md:grid-cols-3 md:gap-4">
          {tiers.map((t) => (
            <li key={t.id}>
              <TierCard family={family} tier={t} />
            </li>
          ))}
        </ul>
      </article>
    </Reveal>
  );
}
