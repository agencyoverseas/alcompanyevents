import { formatPrice, type Option } from "@/content/formules";

export function OptionCard({ option }: { option: Option }) {
  const fixed = option.note === "Prix fixe";
  return (
    <li className="flex items-center justify-between gap-4 rounded-[20px] border border-line bg-white px-5 py-4">
      <span className="font-medium text-ink">{option.name}</span>
      <span className="shrink-0 text-right">
        {option.price !== null && (
          <span className="smallcaps mr-1.5 text-muted">{fixed ? "prix fixe" : "dès"}</span>
        )}
        <span className="font-display text-xl font-black text-sky-800">{formatPrice(option.price)}</span>
      </span>
    </li>
  );
}
