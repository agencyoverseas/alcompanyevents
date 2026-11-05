import Image from "next/image";
import { cn } from "@/lib/utils";

// ⚠️ Placeholder : public/scene/logo-gold.png et logo-cream.png sont à remplacer
// par les vrais logos (mêmes noms). Ajuster LOGO_RATIO si le format diffère.
const LOGO_RATIO = 640 / 220;

export function Logo({
  tone = "gold",
  height = 40,
  className,
  preload = false,
}: {
  tone?: "gold" | "cream";
  height?: number;
  className?: string;
  preload?: boolean;
}) {
  return (
    <Image
      src={tone === "gold" ? "/scene/logo-gold.png" : "/scene/logo-cream.png"}
      alt="Audrey.L Company"
      width={Math.round(height * LOGO_RATIO)}
      height={height}
      preload={preload}
      className={cn("h-auto select-none", className)}
      style={{ width: Math.round(height * LOGO_RATIO) }}
    />
  );
}
