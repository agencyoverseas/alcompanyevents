"use client";

import { useTexture } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, type RefObject } from "react";
import {
  CanvasTexture,
  MathUtils,
  PlaneGeometry,
  SRGBColorSpace,
  Vector2,
  type Group,
  type MeshStandardMaterial,
  type Texture,
  type Vector3,
} from "three";
import { phase, SCROLL } from "@/lib/gsap";
import { CHARACTER, HAND_UV, RIG, SEQ, clamp01, easeOutBack, easeOutCubic, introTime, sceneState } from "./store";

const BASE_Z = SCROLL.hero.camera.zFrom;

const TEXTURES = [
  "/scene/character-body.webp",
  "/scene/character-head.webp",
  "/scene/character-forearm.webp",
  "/scene/character-strings.webp",
  "/scene/character-irises.webp",
  "/scene/character-eyemask.webp",
  "/scene/character-depth.webp",
  "/scene/character-sleeve.webp",
  "/scene/character-cuff.webp",
];
/** Index des textures de données (pas de conversion sRGB). */
const LINEAR = new Set([5, 6]);

type ShaderLike = { uniforms: Record<string, unknown>; fragmentShader: string };

/**
 * Audrey articulée : corps fixe, tête qui pivote au cou, regard (iris) qui suit la
 * souris puis les ballons, avant-bras qui redescend au coude après le lâcher.
 * Toutes les pièces sont des plans de la taille du personnage, avec la même géométrie
 * et la même carte de profondeur : elles restent superposées au pixel près.
 * displacementScale < 0.35 (cf. brief) : au-delà, les cheveux sombres se creusent.
 */
export function Character({ hand }: { hand: Vector3 }) {
  const gl = useThree((s) => s.gl);
  const [bodyMap, headMap, armMap, stringsMap, irisMap, eyeMask, depth, sleeveMap, cuffMap] = useTexture(
    TEXTURES,
    (textures) => {
      const list = Array.isArray(textures) ? textures : [textures];
      // Couleurs en sRGB ; le masque et la profondeur restent des données linéaires.
      for (const [i, t] of list.entries()) {
        if (LINEAR.has(i)) continue;
        t.colorSpace = SRGBColorSpace;
        t.anisotropy = Math.min(8, gl.capabilities.getMaxAnisotropy());
        t.needsUpdate = true;
      }
    },
  );
  const camera = useThree((s) => s.camera);
  const size = useThree((s) => s.size);

  const smoothDepth = useMemo(() => blurDepth(depth), [depth]);
  useEffect(() => () => smoothDepth.dispose(), [smoothDepth]);

  const img = bodyMap.image as { width: number; height: number };
  const h = CHARACTER.height;
  const w = h * (img.width / img.height);

  // Le corps couvre tout le personnage ; la tête et l'avant-bras n'utilisent que leur
  // rectangle (mêmes UV que le plan entier : alignement exact, beaucoup moins de pixels).
  const geometry = useMemo(() => rectGeometry([0, 0, RIG.size[0], RIG.size[1]], w, h), [w, h]);
  const headGeometry = useMemo(() => rectGeometry(RIG.headRect, w, h), [w, h]);
  const armGeometry = useMemo(() => rectGeometry(RIG.armRect, w, h), [w, h]);
  useEffect(
    () => () => {
      geometry.dispose();
      headGeometry.dispose();
      armGeometry.dispose();
    },
    [geometry, headGeometry, armGeometry],
  );

  // Pixel du personnage (character.png) → coordonnées locales du plan.
  const headPivot = useMemo(() => toLocal(RIG.headPivot, w, h), [w, h]);
  const elbow = useMemo(() => toLocal(RIG.elbow, w, h), [w, h]);
  const shoulder = useMemo(() => toLocal(RIG.shoulder, w, h), [w, h]);

  // Largeur visible au plan z=0 depuis la position de départ de la caméra.
  const fov = "fov" in camera ? (camera as { fov: number }).fov : 35;
  const visibleH = 2 * BASE_Z * Math.tan(MathUtils.degToRad(fov / 2));
  const visibleW = visibleH * (size.width / size.height);
  const x = visibleW * CHARACTER.xFactor;

  // Profondeur réelle du poing : les ficelles 3D partent exactement de la main.
  const handLocal = useMemo(
    () => ({
      x: (HAND_UV.u - 0.5) * w,
      y: (0.5 - HAND_UV.v) * h,
      z: sampleDepth(smoothDepth, HAND_UV.u, HAND_UV.v) * CHARACTER.displacementScale,
    }),
    [w, h, smoothDepth],
  );

  // Iris injectés dans le matériau de la tête : décalés par un uniform, limités au masque.
  const irisUniforms = useMemo(
    () => ({
      irisMap: { value: irisMap },
      eyeMask: { value: eyeMask },
      irisOffset: { value: new Vector2() },
    }),
    [irisMap, eyeMask],
  );
  const onHeadCompile = useMemo(
    () => (shader: ShaderLike) => {
      Object.assign(shader.uniforms, irisUniforms);
      shader.fragmentShader = shader.fragmentShader
        .replace(
          "#include <common>",
          "#include <common>\nuniform sampler2D irisMap;\nuniform sampler2D eyeMask;\nuniform vec2 irisOffset;",
        )
        .replace(
          "#include <map_fragment>",
          `#include <map_fragment>
          vec4 irisC = texture2D(irisMap, vMapUv - irisOffset);
          float eyeM = texture2D(eyeMask, vMapUv).a;
          diffuseColor.rgb = mix(diffuseColor.rgb, irisC.rgb, irisC.a * eyeM);`,
        );
    },
    [irisUniforms],
  );

  const group = useRef<Group>(null);
  const headGroup = useRef<Group>(null);
  const armGroup = useRef<Group>(null);
  const shoulderGroup = useRef<Group>(null);
  const sleeveMat = useRef<MeshStandardMaterial>(null);
  const cuffMat = useRef<MeshStandardMaterial>(null);
  const armMat = useRef<MeshStandardMaterial>(null);
  const bodyMat = useRef<MeshStandardMaterial>(null);
  const headMat = useRef<MeshStandardMaterial>(null);
  const stringsMat = useRef<MeshStandardMaterial>(null);
  const gaze = useRef({ x: 0, y: 0 });

  useFrame((state) => {
    const g = group.current;
    if (!g || !headGroup.current || !armGroup.current || !shoulderGroup.current) return;
    const t = introTime(state.clock.elapsedTime);
    // Entrée : arrivée depuis le bas avec léger dépassement, puis fondu.
    const rise = t < 0 ? 0 : easeOutBack(clamp01((t - SEQ.chair) / 0.75), 1.2);
    const fade = t < 0 ? 0 : easeOutCubic(clamp01((t - SEQ.chair) / 0.6));
    const settle = t < 0 ? 0 : easeOutCubic(clamp01((t - SEQ.character) / 0.5));
    for (const m of [armMat.current, bodyMat.current, headMat.current, sleeveMat.current, cuffMat.current])
      if (m) m.opacity = fade;

    const p = sceneState.progress;
    const cam = phase(p, SCROLL.hero.phases.camera);
    const grow = 1 + 0.08 * cam;
    g.scale.setScalar(grow);
    g.position.set(x * (1 - 0.38 * cam), CHARACTER.y - (1 - rise) * 1.6 - (1 - settle) * 0.07 + cam * 0.12, 0);

    // Regard : la souris, puis les ballons qui s'envolent (en haut à gauche), puis la souris.
    const look = phase(p, RIG.lookAtBalloons) * (1 - phase(p, RIG.lookBack));
    const tx = MathUtils.lerp(sceneState.pointer.x, RIG.balloonGaze[0], look);
    const ty = MathUtils.lerp(sceneState.pointer.y, RIG.balloonGaze[1], look);
    gaze.current.x += (tx - gaze.current.x) * RIG.gazeLerp;
    gaze.current.y += (ty - gaze.current.y) * RIG.gazeLerp;
    const gx = gaze.current.x;
    const gy = gaze.current.y;
    // Décalage en UV (v vers le haut, comme le regard).
    irisUniforms.irisOffset.value.set((gx * RIG.irisRange[0]) / RIG.size[0], (gy * RIG.irisRange[1]) / RIG.size[1]);
    headGroup.current.rotation.z = -gx * RIG.headTilt + look * RIG.headTiltUp;
    headGroup.current.position.set(headPivot.x + gx * 0.012, headPivot.y + gy * 0.006 + look * 0.01, 0);

    // Lâcher : les ficelles du poing partent avec les ballons, puis le bras redescend.
    const release = phase(p, RIG.stringsRelease);
    if (stringsMat.current) stringsMat.current.opacity = fade * (1 - release);
    const lower = phase(p, RIG.armLower);
    const sa = lower * RIG.shoulderAngle;
    const fa = lower * RIG.armAngle;
    shoulderGroup.current.rotation.z = sa;
    armGroup.current.rotation.z = fa;

    // Main (pour accrocher les ficelles 3D) : avant-bras autour du coude, puis bras à l'épaule.
    let hx = handLocal.x - elbow.x;
    let hy = handLocal.y - elbow.y;
    [hx, hy] = [hx * Math.cos(fa) - hy * Math.sin(fa), hx * Math.sin(fa) + hy * Math.cos(fa)];
    hx += elbow.x - shoulder.x;
    hy += elbow.y - shoulder.y;
    [hx, hy] = [hx * Math.cos(sa) - hy * Math.sin(sa), hx * Math.sin(sa) + hy * Math.cos(sa)];
    hand.set(
      g.position.x + (shoulder.x + hx) * grow,
      g.position.y + (shoulder.y + hy) * grow,
      g.position.z + handLocal.z,
    );
  });

  const material = (map: Texture, ref: RefObject<MeshStandardMaterial | null>, head = false) => (
    <meshStandardMaterial
      ref={ref}
      map={map}
      displacementMap={smoothDepth}
      displacementScale={CHARACTER.displacementScale}
      transparent
      depthWrite={false}
      alphaTest={0.02}
      opacity={0}
      roughness={0.85}
      metalness={0}
      onBeforeCompile={head ? onHeadCompile : undefined}
      customProgramCacheKey={head ? () => "audrey-head-iris" : undefined}
    />
  );

  return (
    <group ref={group} position={[x, CHARACTER.y - 1.6, 0]}>
      <mesh geometry={geometry} renderOrder={1}>
        {material(bodyMap, bodyMat)}
      </mesh>
      {/* Bras entier, pivot à l'épaule. Manche et manchette sur la grille du corps
          (déformation de profondeur identique au pixel près, pas de liseré). Ordre : intérieur de la manchette, avant-bras
          (pivot au coude, caché dans la manchette), puis la manche par-dessus. */}
      <group ref={shoulderGroup} position={[shoulder.x, shoulder.y, 0]}>
        <group position={[-shoulder.x, -shoulder.y, 0]}>
          <mesh geometry={geometry} renderOrder={2}>
            {material(cuffMap, cuffMat)}
          </mesh>
          <group ref={armGroup} position={[elbow.x, elbow.y, 0]}>
            <group position={[-elbow.x, -elbow.y, 0]}>
              <mesh geometry={armGeometry} renderOrder={3}>
                {material(armMap, armMat)}
              </mesh>
              <mesh geometry={armGeometry} renderOrder={5}>
                {material(stringsMap, stringsMat)}
              </mesh>
            </group>
          </group>
          <mesh geometry={geometry} renderOrder={4}>
            {material(sleeveMap, sleeveMat)}
          </mesh>
        </group>
      </group>
      {/* Tête : pivote autour du cou */}
      <group ref={headGroup} position={[headPivot.x, headPivot.y, 0]}>
        <group position={[-headPivot.x, -headPivot.y, 0]}>
          <mesh geometry={headGeometry} renderOrder={6}>
            {material(headMap, headMat, true)}
          </mesh>
        </group>
      </group>
    </group>
  );
}

/** Plan couvrant le rectangle [x0, y0, x1, y1] (px du personnage), avec les UV du plan entier. */
function rectGeometry([x0, y0, x1, y1]: readonly [number, number, number, number], w: number, h: number) {
  const [W, H] = RIG.size;
  const sx = Math.max(2, Math.round((CHARACTER.segments[0] * (x1 - x0)) / W));
  const sy = Math.max(2, Math.round((CHARACTER.segments[1] * (y1 - y0)) / H));
  const g = new PlaneGeometry(((x1 - x0) / W) * w, ((y1 - y0) / H) * h, sx, sy);
  g.translate(((x0 + x1) / 2 / W - 0.5) * w, (0.5 - (y0 + y1) / 2 / H) * h, 0);
  const pos = g.getAttribute("position");
  const uv = g.getAttribute("uv");
  for (let i = 0; i < pos.count; i++) uv.setXY(i, pos.getX(i) / w + 0.5, pos.getY(i) / h + 0.5);
  uv.needsUpdate = true;
  return g;
}

function toLocal([px, py]: readonly [number, number], w: number, h: number) {
  return { x: (px / RIG.size[0] - 0.5) * w, y: (0.5 - py / RIG.size[1]) * h };
}

/** Copie floutée de la carte de profondeur (canvas 2D). Sans support de ctx.filter,
 *  on garde la carte d'origine. */
function blurDepth(depth: Texture): Texture {
  const src = depth.image as CanvasImageSource & {
    width: number;
    height: number;
  };
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

/** Valeur (0–1) de la carte de profondeur en (u, v), v mesuré depuis le haut de l'image. */
function sampleDepth(tex: Texture, u: number, v: number): number {
  const src = tex.image as CanvasImageSource & {
    width: number;
    height: number;
  };
  const c = document.createElement("canvas");
  c.width = c.height = 1;
  const ctx = c.getContext("2d", { willReadFrequently: true });
  if (!ctx || !src?.width) return 0.85;
  ctx.drawImage(src, Math.round(u * src.width) - 2, Math.round(v * src.height) - 2, 5, 5, 0, 0, 1, 1);
  return ctx.getImageData(0, 0, 1, 1).data[0] / 255;
}
