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
      className="overflow-x-auto rounded-[20px] border border-line [scrollbar-width:thin]"
    >
      <table className="w-full min-w-[30rem] border-collapse text-left text-sm">
        <caption className="sr-only">Comparatif des formules Essentiel, Signature et Prestige</caption>
        <thead>
          <tr className="bg-white">
            <th scope="col" className="sticky left-0 z-10 w-[9.5rem] bg-white p-4 font-normal text-muted sm:w-auto">
              <span className="smallcaps">Prestation</span>
            </th>
            {tiers.map((t) => (
              <th
                key={t.id}
                scope="col"
                className={cn("w-[6.5rem] p-4 text-center align-bottom md:w-[12rem]", t.popular && "bg-terra/10")}
              >
                {t.popular && <span className="smallcaps mb-1 block text-terra-d">Le plus choisi</span>}
                <span className="font-display text-lg font-semibold text-ink">{t.name}</span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {compareRows.map((row) => (
            <tr key={row.label} className="border-t border-line">
              <th scope="row" className="sticky left-0 z-10 bg-white p-4 font-normal text-ink">
                {row.label}
              </th>
              {tiers.map((t) => {
                const inc = row.tiers.includes(t.id);
                return (
                  <td key={t.id} className={cn("p-4 text-center", t.popular && "bg-terra/5")}>
                    {inc ? (
                      <Check className="mx-auto size-4 text-terra-d" aria-label="Inclus" />
                    ) : (
                      <Minus className="mx-auto size-4 text-line" aria-label="Non inclus" />
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
          <tr className="border-t border-line bg-white">
            <th scope="row" className="sticky left-0 z-10 bg-sky-50 p-4 font-normal text-ink">
              Prix de départ
            </th>
            {tiers.map((t) => (
              <td key={t.id} className={cn("p-4 text-center", t.popular && "bg-terra/10")}>
                <span className="smallcaps block text-muted">dès</span>
                <span className="font-display text-xl font-black text-sky-800">{formatPrice(minPrice(t.id))}</span>
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
    <p className="mt-3 text-xs text-muted sm:hidden" aria-hidden>
      Faites glisser le tableau pour voir le palier Prestige →
    </p>
    </>
  );
}
