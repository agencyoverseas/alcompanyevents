import Image from "next/image";
import { PHOTO_H, PHOTO_W } from "@/content/site";
import { cn } from "@/lib/utils";

/**
 * Photo de réalisation (source 400×516). Rendue en `fill` dans son conteneur.
 * `cover` : pour les cadres plus grands que la taille native, une copie floutée
 * couvre le fond et la photo nette reste à sa taille réelle maximum.
 */
export function Photo({
  src,
  alt,
  sizes,
  className,
  cover = false,
  imgClassName,
}: {
  src: string;
  alt: string;
  sizes: string;
  className?: string;
  cover?: boolean;
  imgClassName?: string;
}) {
  if (!cover) {
    return (
      <div className={cn("relative overflow-hidden bg-surface", className)}>
        <Image src={src} alt={alt} fill sizes={sizes} className={cn("object-cover", imgClassName)} />
      </div>
    );
  }
  return (
    <div className={cn("relative grid place-items-center overflow-hidden bg-surface", className)}>
      <Image
        src={src}
        alt=""
        aria-hidden
        fill
        sizes="200px"
        className="scale-110 object-cover opacity-50 blur-2xl"
      />
      <div
        className="relative h-full max-h-[516px] w-auto max-w-[400px]"
        style={{ aspectRatio: `${PHOTO_W} / ${PHOTO_H}` }}
      >
        <Image src={src} alt={alt} fill sizes={`${PHOTO_W}px`} className={cn("object-cover", imgClassName)} />
      </div>
    </div>
  );
}
