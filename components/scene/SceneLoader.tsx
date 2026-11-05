import { Logo } from "@/components/layout/Logo";

/**
 * Rideau de chargement de la scène 3D. Rendu côté serveur pour être présent dès
 * le premier affichage ; visible uniquement quand <html data-scene="pending">.
 * La progression (useProgress de drei) est écrite par HeroScene via les refs.
 * À data-scene="ready", le rideau remonte (transition CSS).
 */
export function SceneLoader({
  barRef,
  pctRef,
}: {
  barRef: React.Ref<HTMLSpanElement>;
  pctRef: React.Ref<HTMLSpanElement>;
}) {
  return (
    <div
      aria-hidden
      className="scene-loader fixed inset-0 z-[80] flex-col items-center justify-center bg-night"
    >
      <Logo height={64} />
      <div className="mt-8 flex w-[min(320px,70vw)] items-center gap-4">
        <div className="relative h-px flex-1 overflow-hidden bg-night-3">
          <span
            ref={barRef}
            className="bg-gold-gradient absolute inset-0 origin-left"
            style={{ transform: "scaleX(0)" }}
          />
        </div>
        <span ref={pctRef} className="w-10 text-right text-xs tabular-nums text-muted-d">
          0 %
        </span>
      </div>
    </div>
  );
}
