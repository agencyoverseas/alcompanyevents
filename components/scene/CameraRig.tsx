"use client";

import { useFrame } from "@react-three/fiber";
import { phase, SCROLL } from "@/lib/gsap";
import { sceneState } from "./store";

const MAX_ROT = 0.06; // rad
const LERP = 0.05; // par image

/** Avance au scroll (z 5 → 3,4 entre 20 et 70 %) + suit la souris avec amortissement. */
export function CameraRig() {
  useFrame(({ camera }) => {
    const { zFrom, zTo } = SCROLL.hero.camera;
    camera.position.z = zFrom - (zFrom - zTo) * phase(sceneState.progress, SCROLL.hero.phases.camera);
    const tx = sceneState.pointer.y * MAX_ROT;
    const ty = -sceneState.pointer.x * MAX_ROT;
    camera.rotation.x += (tx - camera.rotation.x) * LERP;
    camera.rotation.y += (ty - camera.rotation.y) * LERP;
  });
  return null;
}
