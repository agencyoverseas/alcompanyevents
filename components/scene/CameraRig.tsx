"use client";

import { useFrame } from "@react-three/fiber";
import { phase, SCROLL } from "@/lib/gsap";
import { sceneState } from "./store";

/**
 * Avance au scroll (z 5 → 3,4 entre 20 et 70 %). La caméra ne suit plus la souris :
 * la scène reste stable, seuls le regard et la tête d'Audrey suivent le pointeur.
 */
export function CameraRig() {
  useFrame(({ camera }) => {
    const { zFrom, zTo } = SCROLL.hero.camera;
    camera.position.z = zFrom - (zFrom - zTo) * phase(sceneState.progress, SCROLL.hero.phases.camera);
  });
  return null;
}
