import { Photo } from "./Photo";
import { cn } from "@/lib/utils";

/** Photo si elle existe, sinon tuile graphique sobre (en attendant les photos de la cliente). */
export function PhotoSlot({
  src,
  alt,
  label,
  sizes,
  className,
}: {
  src?: string;
  alt?: string;
  label: string;
  sizes: string;
  className?: string;
}) {
  if (src) return <Photo src={src} alt={alt ?? label} sizes={sizes} className={className} />;
  return (
    <div
      aria-hidden
      className={cn(
        "relative grid place-items-center overflow-hidden bg-[linear-gradient(150deg,var(--sky-50),var(--sand))]",
        className,
      )}
    >
      <span className="absolute -right-6 -top-6 size-24 rounded-full bg-terra/15" />
      <span className="absolute -bottom-8 -left-4 size-28 rounded-full bg-sky-200/50" />
      <span className="relative px-4 text-center font-display text-lg font-semibold text-sky-800">{label}</span>
    </div>
  );
}
