"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import {
  BufferAttribute,
  BufferGeometry,
  Color,
  Line,
  LineBasicMaterial,
  Vector3,
  type Group,
} from "three";
import { phase, SCROLL } from "@/lib/gsap";
import { SEQ, clamp01, easeOutBack, introTime, sceneState } from "./store";

/** Couleurs échantillonnées sur l'image de la cliente (brief §4). */
const PALETTE = {
  terracotta: { base: "#B45A3C", shade: "#963C1E", sheen: "#D07A58" },
  ciel: { base: "#7896B4", shade: "#3C5A78", sheen: "#A8C0D8" },
  creme: { base: "#D2D2B4", shade: "#A8A88A", sheen: "#F0D2D2" },
  sable: { base: "#D2B496", shade: "#A88A6C", sheen: "#EAD6C0" },
} as const;

type Spec = {
  tone: keyof typeof PALETTE;
  /** Position au repos, relative à la main. */
  off: [number, number, number];
  r: number;
  /** Vitesse d'ascension (multiplicateur), retard de départ (0–1), vent. */
  speed: number;
  delay: number;
  amp: number;
  freq: number;
  ph: number;
  drift: number;
};

// Huit ballons, chacun avec sa vitesse et son amplitude : c'est ce qui crée le naturel.
const BALLOONS: Spec[] = [
  { tone: "terracotta", off: [-0.42, 0.78, 0.05], r: 0.2, speed: 1.15, delay: 0.1, amp: 0.18, freq: 1.6, ph: 0.2, drift: -0.35 },
  { tone: "ciel", off: [-0.05, 1.02, -0.12], r: 0.215, speed: 0.95, delay: 0.3, amp: 0.24, freq: 1.2, ph: 1.4, drift: 0.1 },
  { tone: "creme", off: [0.36, 0.84, 0.08], r: 0.2, speed: 1.3, delay: 0.0, amp: 0.15, freq: 2.0, ph: 2.1, drift: 0.4 },
  { tone: "sable", off: [-0.24, 0.5, 0.22], r: 0.18, speed: 1.05, delay: 0.45, amp: 0.2, freq: 1.4, ph: 3.0, drift: -0.15 },
  { tone: "terracotta", off: [0.18, 0.56, 0.28], r: 0.185, speed: 1.4, delay: 0.2, amp: 0.12, freq: 2.3, ph: 0.9, drift: 0.25 },
  { tone: "ciel", off: [0.52, 1.18, -0.05], r: 0.19, speed: 0.85, delay: 0.55, amp: 0.26, freq: 1.0, ph: 4.2, drift: 0.5 },
  { tone: "creme", off: [-0.58, 1.12, -0.15], r: 0.19, speed: 1.0, delay: 0.38, amp: 0.22, freq: 1.3, ph: 5.1, drift: -0.5 },
  { tone: "sable", off: [0.12, 1.34, 0.0], r: 0.2, speed: 0.9, delay: 0.65, amp: 0.2, freq: 1.1, ph: 2.7, drift: 0.05 },
];

/** Décalage horizontal de la grappe : la main est à gauche du personnage,
 *  la grappe part vers l'extérieur pour ne pas couvrir le visage. */
const CLUSTER_X = -0.2;

/** Compression verticale de la grappe (garde le haut sous le header). */
const CLUSTER_Y = 0.62;

/** Hauteur à parcourir pour sortir par le haut, même caméra avancée. */
const EXIT_RISE = 4.6;
const STRING_SEGMENTS = 16;

export function Balloons({ hand }: { hand: Vector3 }) {
  const groups = useRef<(Group | null)[]>([]);

  // Ficelles : THREE.Line natives (1px), buffers réécrits en place, sans allocation.
  const strings = useMemo(
    () =>
      BALLOONS.map(() => {
        const geo = new BufferGeometry();
        geo.setAttribute("position", new BufferAttribute(new Float32Array((STRING_SEGMENTS + 1) * 3), 3));
        const mat = new LineBasicMaterial({ color: new Color("#E3C98E"), transparent: true, opacity: 0.55 });
        return new Line(geo, mat);
      }),
    [],
  );

  const tmp = useMemo(
    () => ({ top: new Vector3(), end: new Vector3(), mid: new Vector3(), dangle: new Vector3() }),
    [],
  );

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    const t = introTime(time);
    const p = sceneState.progress;
    const relax = phase(p, SCROLL.hero.phases.stringsRelax);

    BALLOONS.forEach((b, i) => {
      const g = groups.current[i];
      const line = strings[i];
      if (!g) return;

      // Étape 4 de l'entrée : un par un (70 ms), avec rebond.
      const appear = t < 0 ? 0 : easeOutBack(clamp01((t - (SEQ.balloonsStart + i * SEQ.balloonStagger)) / 0.55), 2.2);

      // Trajectoire calculée sur la progression, pas de physique.
      const [r0, r1] = SCROLL.hero.phases.balloonsRise;
      const start = r0 + b.delay * 0.25;
      const rise = clamp01((p - start) / (r1 - start));
      const lift = relax * 0.14 + Math.pow(rise, 1.35) * EXIT_RISE * b.speed;
      const wind = b.amp * Math.sin(b.freq * lift * 2 + b.ph) * (0.25 + rise);

      // Respiration au repos.
      const bobY = Math.sin(time * 1.1 + i * 1.7) * 0.025;
      const bobX = Math.cos(time * 0.8 + i) * 0.015;

      const x = hand.x + b.off[0] + CLUSTER_X + wind + b.drift * rise + bobX;
      const y = hand.y + b.off[1] * CLUSTER_Y + lift + bobY;
      const z = hand.z + b.off[2];
      g.position.set(x, y, z);
      g.scale.setScalar(Math.max(0.0001, appear));
      g.rotation.z = -Math.cos(b.freq * lift * 2 + b.ph) * b.amp * 0.6 * (0.3 + rise) + bobX * 2;

      // Ficelle : du nœud du ballon vers la main, se détend puis se détache.
      const release = clamp01((p - (0.24 + b.delay * 0.18)) / 0.2);
      tmp.top.set(x, y - b.r * 1.18 * appear, z);
      const restLen = Math.hypot(b.off[0] + CLUSTER_X, b.off[1] * CLUSTER_Y, b.off[2]) - b.r;
      tmp.dangle.set(
        x - Math.sin(time * 1.3 + i) * 0.08 - wind * 0.4,
        y - b.r - restLen * 0.55,
        z,
      );
      tmp.end.copy(hand).lerp(tmp.dangle, release);
      tmp.mid.copy(tmp.top).lerp(tmp.end, 0.5);
      tmp.mid.y -= (0.04 + relax * 0.22) * (1 - release);
      tmp.mid.x += wind * 0.5;

      const pos = line.geometry.getAttribute("position") as BufferAttribute;
      for (let s = 0; s <= STRING_SEGMENTS; s++) {
        const u = s / STRING_SEGMENTS;
        const a = (1 - u) * (1 - u);
        const bq = 2 * (1 - u) * u;
        const c = u * u;
        pos.setXYZ(
          s,
          a * tmp.top.x + bq * tmp.mid.x + c * tmp.end.x,
          a * tmp.top.y + bq * tmp.mid.y + c * tmp.end.y,
          a * tmp.top.z + bq * tmp.mid.z + c * tmp.end.z,
        );
      }
      pos.needsUpdate = true;
      line.geometry.computeBoundingSphere();
      (line.material as LineBasicMaterial).opacity = 0.55 * Math.min(1, appear) * (1 - clamp01((rise - 0.6) / 0.3));
    });
  });

  return (
    <>
      {BALLOONS.map((b, i) => {
        const c = PALETTE[b.tone];
        return (
          <group key={i} ref={(el) => void (groups.current[i] = el)} scale={0.0001}>
            {/* Légèrement ovale, comme un vrai ballon */}
            <mesh scale={[1, 1.15, 1]}>
              <sphereGeometry args={[b.r, 40, 32]} />
              <meshPhysicalMaterial
                color={c.base}
                roughness={0.25}
                metalness={0.05}
                clearcoat={0.6}
                clearcoatRoughness={0.25}
                sheen={0.4}
                sheenColor={c.sheen}
              />
            </mesh>
            {/* Nœud */}
            <mesh position={[0, -b.r * 1.15, 0]} rotation={[Math.PI, 0, 0]}>
              <coneGeometry args={[b.r * 0.12, b.r * 0.16, 12]} />
              <meshStandardMaterial color={c.shade} roughness={0.4} />
            </mesh>
          </group>
        );
      })}
      {strings.map((line, i) => (
        <primitive key={`s${i}`} object={line} />
      ))}
    </>
  );
}
