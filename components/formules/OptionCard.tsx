import { formatPrice, type Option } from "@/content/formules";

export function OptionCard({ option }: { option: Option }) {
  const fixed = option.note === "Prix fixe";
  return (
    <li className="flex items-center justify-between gap-4 rounded-[10px] border border-night-3 bg-night-2/60 px-5 py-4">
      <span className="text-light">{option.name}</span>
      <span className="shrink-0 text-right">
        {option.price !== null && (
          <span className="smallcaps mr-1.5 text-muted-d">{fixed ? "prix fixe" : "dès"}</span>
        )}
        <span className="font-display text-xl text-gold-l">{formatPrice(option.price)}</span>
      </span>
    </li>
  );
}
