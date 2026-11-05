import { cn } from "@/lib/utils";

// ⚠️ Logo réel non fourni : marque typographique de la maquette en attendant.
// Pour passer au fichier : remplacer ce rendu par <Image src="/scene/logo-…" />.
export function Logo({
  tone = "dark",
  size = "md",
  className,
}: {
  tone?: "dark" | "light";
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  return (
    <span
      className={cn(
        "flex flex-col leading-none",
        tone === "light" ? "text-white" : "text-ink",
        className,
      )}
    >
      <b
        className={cn(
          "font-display font-black uppercase tracking-[0.14em]",
          size === "sm" && "text-[0.95rem]",
          size === "md" && "text-[1.05rem]",
          size === "lg" && "text-2xl",
        )}
      >
        Audrey.L
      </b>
      <span
        className={cn(
          "mt-1 text-[0.58rem] uppercase tracking-[0.2em]",
          tone === "light" ? "text-muted-dark" : "text-muted",
          size === "lg" && "text-[0.7rem]",
        )}
      >
        Company
      </span>
    </span>
  );
}
