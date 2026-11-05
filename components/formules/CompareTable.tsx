import { Check, Minus } from "lucide-react";
import { compareRows, families, formatPrice, tiers } from "@/content/formules";
import { cn } from "@/lib/utils";

const minPrice = (tierId: (typeof tiers)[number]["id"]) => {
  const ps = families.map((f) => f.prices[tierId]).filter((p): p is number => p !== null);
  return ps.length ? Math.min(...ps) : null;
};

/**
 * Comparatif des trois paliers. Mobile : défilement horizontal, première colonne figée.
 * Lisible à 375px (colonne figée 9,5rem + colonnes de 6,5rem).
 */
export function CompareTable() {
  return (
    <>
    <div
      role="region"
      aria-labelledby="compare-title"
      tabIndex={0}
      className="overflow-x-auto rounded-[10px] border border-night-3 [scrollbar-width:thin]"
    >
      <table className="w-full min-w-[30rem] border-collapse text-left text-sm">
        <caption className="sr-only">Comparatif des formules Essentiel, Signature et Prestige</caption>
        <thead>
          <tr className="bg-night-2">
            <th scope="col" className="sticky left-0 z-10 w-[9.5rem] bg-night-2 p-4 font-normal text-muted-d sm:w-auto">
              <span className="smallcaps">Prestation</span>
            </th>
            {tiers.map((t) => (
              <th
                key={t.id}
                scope="col"
                className={cn("w-[6.5rem] p-4 text-center align-bottom md:w-[12rem]", t.popular && "bg-gold/10")}
              >
                {t.popular && <span className="smallcaps mb-1 block text-gold-l">Le plus choisi</span>}
                <span className="font-display text-xl font-normal text-light">{t.name}</span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {compareRows.map((row) => (
            <tr key={row.label} className="border-t border-night-3">
              <th scope="row" className="sticky left-0 z-10 bg-night p-4 font-normal text-light/90">
                {row.label}
              </th>
              {tiers.map((t) => {
                const inc = row.tiers.includes(t.id);
                return (
                  <td key={t.id} className={cn("p-4 text-center", t.popular && "bg-gold/5")}>
                    {inc ? (
                      <Check className="mx-auto size-4 text-gold-l" aria-label="Inclus" />
                    ) : (
                      <Minus className="mx-auto size-4 text-night-3" aria-label="Non inclus" />
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
          <tr className="border-t border-night-3 bg-night-2">
            <th scope="row" className="sticky left-0 z-10 bg-night-2 p-4 font-normal text-light/90">
              Prix de départ
            </th>
            {tiers.map((t) => (
              <td key={t.id} className={cn("p-4 text-center", t.popular && "bg-gold/10")}>
                <span className="smallcaps block text-muted-d">dès</span>
                <span className="font-display text-xl text-gold-l">{formatPrice(minPrice(t.id))}</span>
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
    <p className="mt-3 text-xs text-muted-d sm:hidden" aria-hidden>
      Faites glisser le tableau pour voir le palier Prestige →
    </p>
    </>
  );
}
