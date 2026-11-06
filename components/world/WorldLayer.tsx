"use client";

import dynamic from "next/dynamic";
import { useLayoutEffect } from "react";
import { useCanScene } from "@/lib/useMedia";

// three.js n'est chargé que sur bureau (mêmes conditions que la scène du héro).
const WorldScene = dynamic(() => import("./WorldScene"), { ssr: false });

/**
 * Monde 3D de l'accueil : calque fixe derrière toute la page (z négatif).
 * Les sections deviennent des feuilles ; les intermèdes, transparents, ouvrent
 * des fenêtres sur le monde. Sans 3D (mobile, mouvement réduit), rien ne change.
 */
export function WorldLayer() {
  const can = useCanScene();
  useLayoutEffect(() => {
    if (!can) return;
    const html = document.documentElement;
    html.classList.add("world-on");
    return () => html.classList.remove("world-on");
  }, [can]);
  if (!can) return null;
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
      <WorldScene />
    </div>
  );
}

/** Fenêtre sur le monde entre deux feuilles (bureau + 3D uniquement). */
export function Interlude({
  eyebrow,
  text,
}: {
  eyebrow: string;
  text: string;
}) {
  return (
    <div data-interlude className="world-only relative">
      <div className="sticky top-[calc(100svh-150px)] mx-auto flex max-w-[1180px] px-[22px]">
        <p className="rounded-full bg-white/85 px-5 py-2.5 text-[0.9rem] text-ink shadow-[0_10px_30px_-12px_rgba(16,31,43,.35)]">
          <span className="smallcaps mr-3 text-terra-d">{eyebrow}</span>
          {text}
        </p>
      </div>
    </div>
  );
}
