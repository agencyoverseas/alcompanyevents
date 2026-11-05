import Image from "next/image";
import { HERO_SEQUENCE as S } from "@/lib/motion";

/**
 * Visuel du héro sans WebGL : mobile (< 768px), pointeur tactile, mouvement réduit,
 * ou JS absent. C'est la version vue par ~80 % des visiteuses : image fixe,
 * arrivée par le bas avec dépassement, parallaxe CSS (transform seul).
 * Masqué par CSS (.hero-static) dès que la scène 3D va se monter.
 */
export function MobileHero() {
  return (
    <div className="hero-static pointer-events-none absolute inset-0">
      <div className="hero-parallax relative h-full w-full">
        {/* Halo doré derrière la mascotte */}
        <div className="hero-seq seq-rise relative h-full w-full" style={{ ["--d" as string]: `${S.chair}s` }}>
          <Image
            src="/scene/mascot.webp"
            alt="Audrey, en personnage 3D, assise dans son fauteuil moutarde avec une grappe de ballons"
            fill
            preload
            fetchPriority="high"
            sizes="(max-width: 767px) 240px, 45vw"
            className="object-contain object-bottom drop-shadow-[0_18px_30px_rgba(0,0,0,.28)]"
          />
        </div>
      </div>
    </div>
  );
}
