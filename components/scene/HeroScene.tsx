"use client";

import { useProgress } from "@react-three/drei";
import { Canvas, useThree } from "@react-three/fiber";
import { Component, Suspense, useEffect, useMemo, useRef, useState, type RefObject } from "react";
import { Vector3 } from "three";
import { gsap, rescrollToHash, SCROLL, useGSAP } from "@/lib/gsap";
import { Balloons } from "./Balloons";
import { CameraRig } from "./CameraRig";
import { Character } from "./Character";
import { Lights } from "./Lights";
import { NAVIGATE_EVENT } from "@/components/layout/PageTransition";
import { sceneState } from "./store";

type Props = {
  sectionRef: RefObject<HTMLElement | null>;
  copyRef: RefObject<HTMLDivElement | null>;
  cueRef: RefObject<HTMLDivElement | null>;
  teaserRef: RefObject<HTMLDivElement | null>;
  onProgress: (p: number) => void;
};

const setScene = (v: string) => document.documentElement.setAttribute("data-scene", v);

/**
 * Scène WebGL du héro + pin GSAP. Module chargé en next/dynamic (ssr: false),
 * uniquement sur bureau : three.js n'apparaît jamais dans le bundle mobile.
 */
export default function HeroScene({ sectionRef, copyRef, cueRef, teaserRef, onProgress }: Props) {
  const [visible, setVisible] = useState(true);
  const [leaving, setLeaving] = useState(false);

  // Transition de page : l'écran va être couvert, on libère le GPU.
  useEffect(() => {
    const onNav = () => setLeaving(true);
    window.addEventListener(NAVIGATE_EVENT, onNav);
    return () => window.removeEventListener(NAVIGATE_EVENT, onNav);
  }, []);

  // Pin sur trois hauteurs d'écran ; la timeline lissée pilote la scène.
  useGSAP(
    () => {
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: SCROLL.hero.end,
          pin: true,
          scrub: SCROLL.hero.scrub,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
        onUpdate: () => {
          sceneState.progress = tl.progress();
        },
      });
      tl.to({}, { duration: 1 }, 0);
      const [a, b] = SCROLL.hero.phases.textOut;
      tl.to([copyRef.current, cueRef.current], { autoAlpha: 0, y: -70, duration: b - a }, a);
      tl.fromTo(teaserRef.current, { yPercent: 100, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: b - a }, a);
      rescrollToHash();
    },
    { scope: sectionRef },
  );

  // Pause de la boucle de rendu hors viewport.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { rootMargin: "100px" });
    io.observe(el);
    return () => io.disconnect();
  }, [sectionRef]);

  // Pointeur normalisé pour le tilt (le DOM du héro est au-dessus du canvas).
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      sceneState.pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      sceneState.pointer.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      sceneState.progress = 0;
      sceneState.introStart = -1;
      sceneState.pointer.x = sceneState.pointer.y = 0;
    };
  }, []);

  const { progress } = useProgress();
  useEffect(() => onProgress(progress), [progress, onProgress]);

  return (
    <div className="absolute inset-0" data-cursor="view" aria-hidden>
      <SceneErrorBoundary>
        <Canvas
          frameloop={visible && !leaving ? "always" : "never"}
          dpr={[1, 1.75]}
          camera={{ fov: 35, position: [0, 0, SCROLL.hero.camera.zFrom], near: 0.1, far: 50 }}
          gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
          onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
        >
          <Lights />
          <Suspense fallback={null}>
            <SceneContent />
            <Ready onProgress={onProgress} />
          </Suspense>
          <CameraRig />
        </Canvas>
      </SceneErrorBoundary>
    </div>
  );
}

function SceneContent() {
  const hand = useMemo(() => new Vector3(), []);
  // Character avant Balloons : il écrit la position de la main lue par les ballons.
  return (
    <>
      <Character hand={hand} />
      <Balloons hand={hand} />
    </>
  );
}

/** Monté quand toutes les textures sont prêtes : attend les polices puis lance la séquence. */
function Ready({ onProgress }: { onProgress: (p: number) => void }) {
  const clock = useThree((s) => s.clock);
  const done = useRef(false);
  useEffect(() => {
    let cancelled = false;
    onProgress(100);
    document.fonts.ready.then(() => {
      if (cancelled || done.current) return;
      done.current = true;
      // Laisse le rideau atteindre 100 % une frame avant de s'ouvrir.
      requestAnimationFrame(() => {
        sceneState.introStart = clock.elapsedTime;
        setScene("ready");
      });
    });
    return () => {
      cancelled = true;
    };
  }, [clock, onProgress]);
  return null;
}

/** WebGL indisponible : on retombe sur le visuel statique. */
class SceneErrorBoundary extends Component<{ children: React.ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    setScene("off");
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}
