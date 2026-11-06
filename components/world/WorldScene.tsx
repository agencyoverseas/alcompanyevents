"use client";

import { Cloud, Clouds, useTexture } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  Component,
  Suspense,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  CanvasTexture,
  CatmullRomCurve3,
  Color,
  DoubleSide,
  MeshBasicMaterial,
  Object3D,
  PlaneGeometry,
  SRGBColorSpace,
  Vector3,
  type Group,
  type InstancedMesh,
  type Mesh,
} from "three";
import { NAVIGATE_EVENT } from "@/components/layout/PageTransition";
import {
  ATTENTION,
  AUDREY,
  BALLOON,
  FINAL_ARCH,
  ISLANDS,
  KEYS,
  MARKERS,
} from "./config";

/**
 * Monde 3D temps réel de l'accueil (bureau uniquement, chargé en next/dynamic).
 * Une caméra et Audrey parcourent une seule trajectoire continue ; le scroll
 * des intermèdes ([data-interlude]) fait avancer P de 0 à 4.
 */

const world = { P: 0, Pd: 0 };
const smooth = (x: number) => x * x * (3 - 2 * x);
const clamp01 = (x: number) => Math.min(1, Math.max(0, x));

type Capture = { t?: number };
const capture = (): Capture | null =>
  typeof window !== "undefined" &&
  new URLSearchParams(window.location.search).has("capture")
    ? ((window as unknown as { __world: Capture }).__world ??= {})
    : null;

export default function WorldScene() {
  const [active, setActive] = useState(false);
  const [leaving, setLeaving] = useState(false);

  // Rendu uniquement quand un intermède est à l'écran (les feuilles couvrent le reste).
  useEffect(() => {
    const els = Array.from(document.querySelectorAll("[data-interlude]"));
    const seen = new Set<Element>();
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) =>
          e.isIntersecting ? seen.add(e.target) : seen.delete(e.target),
        );
        setActive(seen.size > 0);
      },
      { rootMargin: "15% 0px" },
    );
    els.forEach((el) => io.observe(el));
    const onNav = () => setLeaving(true);
    window.addEventListener(NAVIGATE_EVENT, onNav);
    return () => {
      io.disconnect();
      window.removeEventListener(NAVIGATE_EVENT, onNav);
    };
  }, []);

  return (
    <ErrorBoundary>
      <Canvas
        frameloop={active && !leaving ? "always" : "never"}
        flat
        dpr={[1, 1.6]}
        camera={{ fov: 42, near: 0.1, far: 260, position: [0, -1, 9] }}
        gl={{ antialias: true, powerPreference: "high-performance" }}
      >
        <World />
      </Canvas>
    </ErrorBoundary>
  );
}

function World() {
  return (
    <>
      <fog attach="fog" args={["#d6e8f4", 18, 95]} />
      <hemisphereLight args={["#ffffff", "#b9d4e8", 1.6]} />
      <directionalLight position={[6, 10, 6]} intensity={1.6} color="#fff1dc" />
      <Progress />
      <Sky />
      <Suspense fallback={null}>
        <Clouds
          texture="/world/cloud.png"
          material={MeshBasicMaterial}
          limit={420}
          frustumCulled={false}
        >
          <CloudField />
        </Clouds>
        <BalloonDecor />
        <DriftBalloons />
        <Markers />
        <Audrey />
      </Suspense>
    </>
  );
}

/* --------------------------- Scroll → P --------------------------- */
function Progress() {
  const els = useRef<HTMLElement[]>([]);
  useEffect(() => {
    els.current = Array.from(
      document.querySelectorAll<HTMLElement>("[data-interlude]"),
    );
  }, []);
  useFrame((_, dt) => {
    const vh = window.innerHeight;
    let P = 0;
    for (const el of els.current) {
      const r = el.getBoundingClientRect();
      P += clamp01((vh - r.top) / (vh + r.height));
    }
    world.P = P;
    world.Pd = capture()
      ? P
      : world.Pd + (P - world.Pd) * (1 - Math.exp(-dt * 5));
  }, -2);
  return null;
}

const curve = (k: "cam" | "look" | "audrey") =>
  new CatmullRomCurve3(
    KEYS.map((key) => new Vector3(...key[k])),
    false,
    "centripetal",
  );
const CAM = curve("cam");
const LOOK = curve("look");
const AUD = curve("audrey");
const tOf = (P: number) => clamp01(P / 4);

function elapsed(clock: { elapsedTime: number }) {
  const c = capture();
  return c?.t ?? clock.elapsedTime;
}

/* ------------------------------ Ciel ------------------------------ */
function Sky() {
  const ref = useRef<Mesh>(null);
  useFrame(({ camera }) => ref.current?.position.copy(camera.position), -1);
  return (
    <mesh ref={ref} renderOrder={-10}>
      <sphereGeometry args={[200, 32, 16]} />
      <shaderMaterial
        side={DoubleSide}
        depthWrite={false}
        fog={false}
        uniforms={{
          top: { value: new Color("#3a80af") },
          mid: { value: new Color("#d6e8f4") },
          low: { value: new Color("#f4f8fb") },
          sun: { value: new Vector3(0.45, 0.35, -0.8).normalize() },
        }}
        vertexShader={`varying vec3 vDir; void main(){ vDir = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`}
        fragmentShader={`uniform vec3 top; uniform vec3 mid; uniform vec3 low; uniform vec3 sun; varying vec3 vDir;
          void main(){ vec3 d = normalize(vDir); float h = d.y;
            vec3 c = h > 0.0 ? mix(mid, top, smoothstep(0.0, 0.75, h)) : mix(mid, low, smoothstep(0.0, 0.35, -h));
            float s = max(dot(d, sun), 0.0); c += vec3(1.0,0.93,0.82) * (pow(s, 24.0) * 0.55 + pow(s, 4.0) * 0.08);
            gl_FragColor = vec4(c, 1.0); }`}
      />
    </mesh>
  );
}

/* ----------------------------- Nuages ----------------------------- */
// Positions fixes (pas d'aléatoire au rendu) : nuages du décor le long du trajet.
const FIELD: [number, number, number, number][] = [
  // x, y, z, taille
  [-5, -2.5, -4, 1.4],
  [5.5, -1.5, -6, 1.2],
  [-3, 3, -8, 1.1],
  [7, 4.5, -3, 0.9],
  [-6, 7, -12, 1.5],
  [2, 13, -20, 1.6],
  [12, 6.5, -18, 1.3],
  [16, 15, -12, 1.2],
  [-2, 10.5, -18, 1.1],
  [9, 15.5, -24, 1.4],
  [26, 9, -18, 1.4],
  [29, 15.5, -30, 1.5],
  [18, 8.5, -32, 1.3],
  [20, 17.5, -40, 1.6],
  [30, 11, -44, 1.5],
  [14, 12.5, -40, 1.1],
  [33, 18, -38, 1.2],
  [6, 18, -36, 1.4],
  [-4, 1, -20, 1.3],
  [24, 6.5, -46, 1.6],
];

function CloudField() {
  return (
    <>
      {FIELD.map(([x, y, z, s], i) => (
        <Cloud
          key={`f${i}`}
          seed={i + 1}
          position={[x, y, z]}
          bounds={[3 * s, 0.8 * s, 1.6 * s]}
          segments={10}
          volume={4 * s}
          opacity={0.9}
          color="#ffffff"
          fade={30}
        />
      ))}
      {/* Îles des quatre univers */}
      {ISLANDS.map(({ at }, i) => (
        <Cloud
          key={`i${i}`}
          fade={0}
          seed={40 + i}
          position={[at[0], at[1] - 0.3, at[2]]}
          bounds={[1.3, 0.2, 0.9]}
          segments={12}
          volume={1.2}
          opacity={1}
          color="#ffffff"
          concentrate="inside"
        />
      ))}
      {/* Chemin du déroulé */}
      {MARKERS.map((m, i) => (
        <Cloud
          key={`m${i}`}
          fade={0}
          seed={60 + i}
          position={[m[0], m[1] - 0.15, m[2]]}
          bounds={[0.8, 0.15, 0.6]}
          segments={8}
          volume={0.8}
          opacity={1}
          color="#ffffff"
        />
      ))}
      {/* Socle de l'arche finale */}
      <Cloud
        seed={80}
        fade={0}
        position={[FINAL_ARCH.at[0], FINAL_ARCH.at[1] - 0.35, FINAL_ARCH.at[2]]}
        bounds={[2.8, 0.2, 1.2]}
        segments={16}
        volume={1.5}
        opacity={1}
        color="#ffffff"
        concentrate="inside"
      />
      <AudreyCloud />
    </>
  );
}

/** Le petit nuage qui porte Audrey ; suit sa position. */
function AudreyCloud() {
  const ref = useRef<Group>(null);
  const v = useMemo(() => new Vector3(), []);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    AUD.getPoint(tOf(world.Pd), v);
    const t = elapsed(clock);
    ref.current.position.set(
      v.x,
      v.y - 0.16 + Math.sin(t * AUDREY.bob.freq) * AUDREY.bob.amp,
      v.z,
    );
  });
  return (
    <group ref={ref}>
      <Cloud
        seed={99}
        bounds={[0.4, 0.04, 0.26]}
        segments={8}
        volume={0.34}
        opacity={1}
        color="#ffffff"
      />
    </group>
  );
}

/* ----------------------------- Ballons ---------------------------- */
type B = { p: Vector3; r: number; c: string };

function arch(
  center: readonly [number, number, number],
  radius: number,
  n: number,
  tones: (keyof typeof BALLOON)[],
  r: number,
) {
  const out: B[] = [];
  for (let i = 0; i < n; i++) {
    const a = Math.PI * (i / (n - 1));
    const p = new Vector3(
      center[0] - Math.cos(a) * radius,
      center[1] + 0.15 + Math.sin(a) * radius * 1.05,
      center[2],
    );
    out.push({
      p,
      r: r * (i % 3 === 1 ? 0.82 : 1),
      c: BALLOON[tones[i % tones.length]],
    });
    // Double rangée, légèrement décalée en profondeur : volume de « vraie » arche.
    if (i % 2 === 0)
      out.push({
        p: p.clone().add(new Vector3(0, 0.05, 0.22)),
        r: r * 0.7,
        c: BALLOON[tones[(i + 1) % tones.length]],
      });
  }
  return out;
}

const DECOR: B[] = [
  ...ISLANDS.flatMap((isl) => arch(isl.at, 0.95, 11, isl.tones, 0.2)),
  ...arch(
    FINAL_ARCH.at,
    FINAL_ARCH.radius,
    21,
    ["terracotta", "creme", "ciel", "sable"],
    0.3,
  ),
  // Balises du déroulé : trois ballons empilés.
  ...MARKERS.flatMap((m, i) =>
    [0, 1, 2].map((k) => ({
      p: new Vector3(
        m[0] + (k === 1 ? 0.12 : -0.05),
        m[1] + 0.35 + k * 0.42,
        m[2],
      ),
      r: 0.21,
      c: BALLOON[(["terracotta", "ciel", "sable"] as const)[(i + k) % 3]],
    })),
  ),
];

function BalloonDecor() {
  const ref = useRef<InstancedMesh>(null);
  useLayoutEffect(() => {
    const m = ref.current;
    if (!m) return;
    const o = new Object3D();
    const c = new Color();
    DECOR.forEach((b, i) => {
      o.position.copy(b.p);
      o.scale.set(b.r, b.r * 1.15, b.r);
      o.updateMatrix();
      m.setMatrixAt(i, o.matrix);
      m.setColorAt(i, c.set(b.c));
    });
    m.instanceMatrix.needsUpdate = true;
    if (m.instanceColor) m.instanceColor.needsUpdate = true;
  }, []);
  return (
    <instancedMesh
      ref={ref}
      args={[undefined, undefined, DECOR.length]}
      frustumCulled={false}
    >
      <sphereGeometry args={[1, 28, 20]} />
      <meshStandardMaterial roughness={0.28} metalness={0.05} />
    </instancedMesh>
  );
}

// Ballons qui montent librement (continuité avec l'envol du héro).
const DRIFT = Array.from({ length: 18 }, (_, i) => {
  const tones = Object.values(BALLOON);
  return {
    x: ((i * 37) % 23) - 8 + (i % 4) * 4,
    z: -((i * 53) % 29) + 2 - i * 0.6,
    y0: -6 + ((i * 71) % 13),
    speed: 0.35 + ((i * 13) % 7) * 0.06,
    r: 0.16 + ((i * 7) % 5) * 0.02,
    c: tones[i % tones.length],
    ph: i * 1.7,
  };
});

function DriftBalloons() {
  const ref = useRef<InstancedMesh>(null);
  const o = useMemo(() => new Object3D(), []);
  useLayoutEffect(() => {
    const m = ref.current;
    if (!m) return;
    const c = new Color();
    DRIFT.forEach((b, i) => m.setColorAt(i, c.set(b.c)));
    if (m.instanceColor) m.instanceColor.needsUpdate = true;
  }, []);
  useFrame(({ clock }) => {
    const m = ref.current;
    if (!m) return;
    const t = elapsed(clock);
    DRIFT.forEach((b, i) => {
      const y = b.y0 + ((t * b.speed + b.ph) % 26);
      o.position.set(b.x + Math.sin(t * 0.6 + b.ph) * 0.3, y, b.z);
      o.scale.set(b.r, b.r * 1.15, b.r);
      o.updateMatrix();
      m.setMatrixAt(i, o.matrix);
    });
    m.instanceMatrix.needsUpdate = true;
  });
  return (
    <instancedMesh
      ref={ref}
      args={[undefined, undefined, DRIFT.length]}
      frustumCulled={false}
    >
      <sphereGeometry args={[1, 24, 16]} />
      <meshStandardMaterial roughness={0.3} metalness={0.05} />
    </instancedMesh>
  );
}

/** Numéros 01 → 04 au-dessus des balises (texture canvas, police du site). */
function Markers() {
  const textures = useMemo(() => {
    const family =
      getComputedStyle(document.documentElement)
        .getPropertyValue("--font-display")
        .trim() || "Georgia";
    return MARKERS.map((_, i) => {
      const c = document.createElement("canvas");
      c.width = c.height = 256;
      const g = c.getContext("2d")!;
      g.fillStyle = "rgba(255,255,255,0.94)";
      g.beginPath();
      g.arc(128, 128, 120, 0, Math.PI * 2);
      g.fill();
      g.fillStyle = "#A7522F";
      g.font = `900 118px ${family}, Georgia, serif`;
      g.textAlign = "center";
      g.textBaseline = "middle";
      g.fillText(String(i + 1).padStart(2, "0"), 128, 136);
      const t = new CanvasTexture(c);
      t.colorSpace = SRGBColorSpace;
      return t;
    });
  }, []);
  return (
    <>
      {MARKERS.map((m, i) => (
        <sprite key={i} position={[m[0], m[1] + 1.85, m[2]]} scale={0.5}>
          <spriteMaterial map={textures[i]} toneMapped={false} depthWrite={false} alphaTest={0.02} />
        </sprite>
      ))}
    </>
  );
}

/* ----------------------- Caméra + Audrey ------------------------- */
// Vues de l'atlas : 0 face, 1 trois-quarts avant (regarde à droite), 2 profil
// (regarde à droite), 3 trois-quarts arrière (regarde à gauche), 4 dos.
// Secteur s = round(α / 45°), α = 0 face caméra, +90° = regarde à droite de l'écran.
const SECTOR: Record<number, [frame: number, mirror: boolean]> = {
  0: [0, false],
  1: [1, false],
  [-1]: [1, true],
  2: [2, false],
  [-2]: [2, true],
  3: [3, true],
  [-3]: [3, false],
  4: [4, false],
  [-4]: [4, false],
};

function Audrey() {
  const tex = useTexture("/world/audrey-atlas.webp");
  const mesh = useRef<Mesh>(null);
  const geo = useMemo(() => {
    const g = new PlaneGeometry(AUDREY.height * AUDREY.aspect, AUDREY.height);
    g.translate(0, AUDREY.height / 2, 0);
    return g;
  }, []);
  const mat = useRef<MeshBasicMaterial>(null);
  useLayoutEffect(() => {
    const m = mat.current;
    if (!m) return;
    const atlas = tex.clone();
    atlas.colorSpace = SRGBColorSpace;
    atlas.repeat.set(1 / AUDREY.frames, 1);
    atlas.anisotropy = 8;
    atlas.needsUpdate = true;
    m.map = atlas;
    m.needsUpdate = true;
    return () => atlas.dispose();
  }, [tex]);

  const tmp = useMemo(
    () => ({
      pos: new Vector3(),
      look: new Vector3(),
      tan: new Vector3(),
      toCam: new Vector3(),
      right: new Vector3(),
      f: new Vector3(),
    }),
    [],
  );
  const state = useRef({ sector: 0, flipAt: -10 });

  useFrame(({ camera, clock }) => {
    const m = mesh.current;
    if (!m) return;
    const { pos, look, tan, toCam, right, f } = tmp;
    const t = tOf(world.Pd);
    const now = elapsed(clock);

    // Caméra sur sa trajectoire, avec une respiration très légère.
    CAM.getPoint(t, camera.position);
    camera.position.y += Math.sin(now * 0.5) * 0.04;
    LOOK.getPoint(t, look);
    camera.lookAt(look);

    // Audrey : position, flottement, billboard vertical tourné vers la caméra.
    AUD.getPoint(t, pos);
    m.position.set(
      pos.x,
      pos.y + Math.sin(now * AUDREY.bob.freq) * AUDREY.bob.amp,
      pos.z,
    );
    m.rotation.set(
      0,
      Math.atan2(camera.position.x - pos.x, camera.position.z - pos.z),
      0,
    );

    // Direction voulue : celle de la marche, attirée vers la visiteuse au centre d'un intermède.
    AUD.getTangent(Math.min(t, 0.995), tan).setY(0).normalize();
    toCam
      .set(camera.position.x - pos.x, 0, camera.position.z - pos.z)
      .normalize();
    const k = Math.min(3, Math.floor(world.Pd));
    const frac = world.Pd - k;
    let w = ATTENTION[k] * smooth(clamp01(1 - Math.abs(frac - 0.5) / 0.38));
    if (k === 3 && frac > 0.5) w = 1;
    f.copy(tan).lerp(toCam, w);
    if (f.lengthSq() < 1e-4) f.copy(toCam);
    f.normalize();
    right.set(toCam.z, 0, -toCam.x); // droite de l'écran vue depuis la caméra
    const alpha = Math.atan2(f.dot(right), f.dot(toCam)) * (180 / Math.PI);

    // Secteur avec hystérésis (pas de clignotement à la frontière).
    const s = state.current;
    if (Math.abs(alpha - s.sector * 45) > 30) {
      const next = Math.max(-4, Math.min(4, Math.round(alpha / 45)));
      if (next !== s.sector) {
        s.sector = next;
        s.flipAt = now;
      }
    }
    const [frame, mirror] = SECTOR[s.sector];
    const map = mat.current?.map;
    map?.offset.setX(frame / AUDREY.frames);
    const ft = clamp01((now - s.flipAt) / AUDREY.flip);
    const squash = 1 - 0.28 * Math.sin(Math.PI * ft);
    m.scale.set((mirror ? -1 : 1) * squash, 1, 1);
  });

  return (
    <mesh ref={mesh} geometry={geo} renderOrder={10}>
      {/* Transparente + renderOrder élevé : dessinée après les nuages, qui ne la voilent pas. */}
      <meshBasicMaterial
        ref={mat}
        transparent
        side={DoubleSide}
        alphaTest={0.45}
        alphaToCoverage
        toneMapped={false}
        fog={false}
      />
    </mesh>
  );
}

class ErrorBoundary extends Component<
  { children: React.ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    document.documentElement.classList.remove("world-on");
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}
