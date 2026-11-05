"use client";

import { useTexture } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import {
  CanvasTexture,
  MathUtils,
  SRGBColorSpace,
  type Group,
  type Mesh,
  type MeshStandardMaterial,
  type Texture,
  type Vector3,
} from "three";
import { phase, SCROLL } from "@/lib/gsap";
import { CHARACTER, HAND_UV, SEQ, clamp01, easeOutBack, easeOutCubic, introTime, sceneState } from "./store";

const BASE_Z = SCROLL.hero.camera.zFrom;
/** Tranche du scroll où les ficelles du poing sont lâchées (alignée sur les ballons). */
const STRINGS_RELEASE = [0.24, 0.42] as const;

/**
 * Plan texturé (character.png) déplacé par sa carte de profondeur.
 * displacementScale < 0.35 (cf. brief) : au-delà, les cheveux sombres se creusent.
 * Écrit la position monde de la main dans `hand` pour accrocher les ficelles.
 */
export function Character({ hand }: { hand: Vector3 }) {
  const gl = useThree((s) => s.gl);
  const [map, depth, stringsMap] = useTexture(
    ["/scene/character.webp", "/scene/character-depth.webp", "/scene/character-strings.webp"],
    (textures) => {
      const list = Array.isArray(textures) ? textures : [textures];
      for (const m of [list[0], list[2]]) {
        if (!m) continue;
        m.colorSpace = SRGBColorSpace;
        m.anisotropy = Math.min(8, gl.capabilities.getMaxAnisotropy());
        m.needsUpdate = true;
      }
    },
  );
  const camera = useThree((s) => s.camera);
  const size = useThree((s) => s.size);

  const smoothDepth = useMemo(() => blurDepth(depth), [depth]);
  useEffect(() => () => smoothDepth.dispose(), [smoothDepth]);

  const img = map.image as { width: number; height: number };
  const h = CHARACTER.height;
  const w = h * (img.width / img.height);

  // Largeur visible au plan z=0 depuis la position de départ de la caméra.
  const fov = "fov" in camera ? (camera as { fov: number }).fov : 35;
  const visibleH = 2 * BASE_Z * Math.tan(MathUtils.degToRad(fov / 2));
  const visibleW = visibleH * (size.width / size.height);
  const x = visibleW * CHARACTER.xFactor;

  const group = useRef<Group>(null);
  const mat = useRef<MeshStandardMaterial>(null);
  // Calque des ficelles tenues dans le poing : visible au repos, il part avec les
  // ballons (monte et s'efface) au moment où ils sont lâchés.
  const strings = useRef<Mesh>(null);
  const stringsMat = useRef<MeshStandardMaterial>(null);
  const handLocal = useMemo(
    () => ({ x: (HAND_UV.u - 0.5) * w, y: (0.5 - HAND_UV.v) * h, z: CHARACTER.displacementScale * 0.85 }),
    [w, h],
  );

  useFrame((state) => {
    const g = group.current;
    const m = mat.current;
    if (!g || !m) return;
    const t = introTime(state.clock.elapsedTime);
    // Étape 2 : arrivée depuis le bas avec léger dépassement.
    const rise = t < 0 ? 0 : easeOutBack(clamp01((t - SEQ.chair) / 0.75), 1.2);
    // Étape 3 : fondu + translation de ~30px (≈ 0,07 unité ici).
    const fade = t < 0 ? 0 : easeOutCubic(clamp01((t - SEQ.chair) / 0.6));
    const settle = t < 0 ? 0 : easeOutCubic(clamp01((t - SEQ.character) / 0.5));
    m.opacity = fade;

    const p = sceneState.progress;
    const grow = 1 + 0.08 * phase(p, SCROLL.hero.phases.camera);
    g.scale.setScalar(grow);
    // Pendant l'avancée de la caméra, on rapproche le personnage du centre pour
    // qu'il grandisse dans le cadre au lieu d'en sortir.
    const cam = phase(p, SCROLL.hero.phases.camera);
    g.position.set(x * (1 - 0.38 * cam), CHARACTER.y - (1 - rise) * 1.6 - (1 - settle) * 0.07 + cam * 0.12, 0);

    // Ficelles du poing : lâchées en même temps que les premiers ballons.
    const release = phase(p, STRINGS_RELEASE);
    if (strings.current && stringsMat.current) {
      stringsMat.current.opacity = fade * (1 - release);
      strings.current.position.y = release * 0.6;
      strings.current.visible = release < 1;
    }

    hand.set(
      g.position.x + handLocal.x * grow,
      g.position.y + handLocal.y * grow,
      g.position.z + handLocal.z,
    );
  });

  return (
    <group ref={group} position={[x, CHARACTER.y - 1.6, 0]}>
      <mesh>
        <planeGeometry args={[w, h, CHARACTER.segments[0], CHARACTER.segments[1]]} />
        <meshStandardMaterial
          ref={mat}
          map={map}
          displacementMap={smoothDepth}
          displacementScale={CHARACTER.displacementScale}
          transparent
          alphaTest={0.02}
          opacity={0}
          roughness={0.85}
          metalness={0}
        />
      </mesh>
      <mesh ref={strings} position={[0, 0, 0.004]} renderOrder={1}>
        <planeGeometry args={[w, h, CHARACTER.segments[0], CHARACTER.segments[1]]} />
        <meshStandardMaterial
          ref={stringsMat}
          map={stringsMap}
          displacementMap={smoothDepth}
          displacementScale={CHARACTER.displacementScale}
          transparent
          depthWrite={false}
          alphaTest={0.02}
          opacity={0}
          roughness={0.85}
          metalness={0}
        />
      </mesh>
    </group>
  );
}

/** Copie floutée de la carte de profondeur (canvas 2D). Sans support de ctx.filter,
 *  on garde la carte d'origine. */
function blurDepth(depth: Texture): Texture {
  const src = depth.image as CanvasImageSource & { width: number; height: number };
  const canvas = document.createElement("canvas");
  const scale = Math.min(1, 1024 / src.width);
  canvas.width = Math.round(src.width * scale);
  canvas.height = Math.round(src.height * scale);
  const ctx = canvas.getContext("2d");
  if (!ctx || !("filter" in ctx)) return depth;
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.filter = `blur(${Math.max(1, Math.round(canvas.width * CHARACTER.depthBlur))}px)`;
  ctx.drawImage(src, 0, 0, canvas.width, canvas.height);
  const tex = new CanvasTexture(canvas);
  tex.flipY = depth.flipY;
  return tex;
}
