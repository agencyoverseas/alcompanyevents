"use client";

import { AnimatePresence, m } from "motion/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ComponentProps,
  type MouseEvent,
} from "react";
import { EASE_IN_OUT, EASE_OUT, PAGE_TRANSITION } from "@/lib/motion";
import { usePrefersReducedMotion } from "@/lib/useMedia";

type Point = { x: number; y: number };
type Overlay = { x: number; y: number; r: number; phase: "cover" | "pop"; seed: number } | null;

/** Lu par app/template.tsx : vrai dès la première navigation client. */
export const navState = { navigated: false };

/** Émis au départ d'une transition : la scène WebGL se met en pause (écran bientôt couvert). */
export const NAVIGATE_EVENT = "alc:navigate";

const Ctx = createContext<{ navigate: (href: string, from?: Point) => void } | null>(null);

const COVER_S = PAGE_TRANSITION.routeChangeMs / 1000; // 0,42 s
const POP_S = 0.85; // éclats

// Ballon bleu : dégradé ciel de la charte, reflet en haut à gauche.
const BALLOON_BG =
  "radial-gradient(circle at 32% 28%, #DCEBF6 0%, #8EC0E2 10%, #4F93C4 34%, #2C6A94 68%, #1E4A69 100%)";
const SHARD_COLORS = ["#3A80AF", "#2C6A94", "#6FAAD3", "#1E4A69", "#4F93C4"];
const CONFETTI_COLORS = ["#6FAAD3", "#BBD9EE", "#C2643E", "#FFFFFF"];

/** Générateur pseudo-aléatoire déterministe (mêmes éclats pour une même transition). */
function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Éclats de latex et confettis projetés depuis le centre du ballon. */
function Burst({ x, y, r, seed, onDone }: { x: number; y: number; r: number; seed: number; onDone: () => void }) {
  const rand = rng(seed);
  // Le ballon se brise : de gros morceaux répartis sur toute sa surface, qui s'écartent.
  const N = 28;
  const shards = Array.from({ length: N }, (_, i) => {
    const a = (i / N) * Math.PI * 2 * 3 + rand() * 0.5; // trois anneaux entrelacés
    const ring = i % 3;
    const start = r * (0.08 + ring * 0.24 + rand() * 0.12);
    const dist = r * (0.35 + rand() * 0.4);
    const size = Math.max(60, r * (0.2 + rand() * 0.16) * (1 - ring * 0.18));
    return {
      a,
      x0: Math.cos(a) * start,
      y0: Math.sin(a) * start,
      x1: Math.cos(a) * (start + dist),
      y1: Math.sin(a) * (start + dist) + r * (0.25 + rand() * 0.2), // gravité
      size,
      rot: (rand() - 0.5) * 540,
      color: SHARD_COLORS[i % SHARD_COLORS.length],
      // forme irrégulière d'un morceau de latex déchiré
      path: `M0 ${20 + rand() * 20} Q ${30 + rand() * 20} ${-10 + rand() * 10} ${100} ${10 + rand() * 30} L ${80 + rand() * 20} ${70 + rand() * 30} Q ${40 + rand() * 20} ${100} ${rand() * 20} ${70 + rand() * 20} Z`,
    };
  });
  const confetti = Array.from({ length: 26 }, (_, i) => {
    const a = rand() * Math.PI * 2;
    const dist = r * (0.3 + rand() * 0.9);
    return {
      x1: Math.cos(a) * dist,
      y1: Math.sin(a) * dist + r * (0.35 + rand() * 0.3),
      size: 8 + rand() * 10,
      rot: rand() * 720,
      color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
      delay: rand() * 0.08,
    };
  });
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[90] overflow-hidden">
      {/* onde de choc */}
      <m.div
        className="absolute rounded-full border-[6px] border-white/80"
        style={{ left: x - r * 0.5, top: y - r * 0.5, width: r, height: r }}
        initial={{ scale: 0.7, opacity: 0.9 }}
        animate={{ scale: 1.9, opacity: 0 }}
        transition={{ duration: 0.45, ease: EASE_OUT }}
      />
      {shards.map((s, i) => (
        <m.svg
          key={`s${i}`}
          viewBox="0 0 100 100"
          className="absolute"
          style={{ left: x - s.size / 2, top: y - s.size / 2, width: s.size, height: s.size }}
          initial={{ x: s.x0, y: s.y0, rotate: 0, scale: 1, opacity: 1 }}
          animate={{ x: s.x1, y: s.y1, rotate: s.rot, scale: 0.35, opacity: 0 }}
          transition={{ duration: POP_S, ease: [0.25, 0.75, 0.35, 1] }}
          onAnimationComplete={i === 0 ? onDone : undefined}
        >
          <path d={s.path} fill={s.color} />
          <path d={s.path} fill="url(#latex-gloss)" opacity="0.35" />
        </m.svg>
      ))}
      {confetti.map((c, i) => (
        <m.span
          key={`c${i}`}
          className="absolute rounded-[2px]"
          style={{ left: x, top: y, width: c.size, height: c.size * 0.45, background: c.color }}
          initial={{ x: 0, y: 0, rotate: 0, opacity: 1 }}
          animate={{ x: c.x1, y: c.y1, rotate: c.rot, opacity: 0 }}
          transition={{ duration: POP_S + 0.15, delay: c.delay, ease: [0.2, 0.8, 0.4, 1] }}
        />
      ))}
      <svg width="0" height="0" className="absolute">
        <defs>
          <linearGradient id="latex-gloss" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#fff" />
            <stop offset="0.6" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

const pathOf = (href: string) => new URL(href, "https://x.local").pathname;

/**
 * Transition « ballon » : un ballon bleu part du point cliqué et couvre l'écran (420 ms),
 * la route change, puis il éclate en morceaux de latex et confettis qui révèlent la
 * nouvelle page (≈ 600 ms).
 * Mouvement réduit : pas de cercle, simple fondu de 200 ms géré par template.tsx.
 */
export function PageTransitionProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const reduced = usePrefersReducedMotion();
  const [overlay, setOverlay] = useState<Overlay>(null);
  const target = useRef<string | null>(null);

  const navigate = useCallback(
    (href: string, from?: Point) => {
      navState.navigated = true;
      const dest = pathOf(href);
      if (reduced || dest === pathname || overlay) {
        router.push(href);
        return;
      }
      const w = window.innerWidth;
      const h = window.innerHeight;
      const x = from?.x ?? w / 2;
      const y = from?.y ?? h / 2;
      const r = Math.hypot(Math.max(x, w - x), Math.max(y, h - y)) + 4;
      target.current = dest;
      window.dispatchEvent(new Event(NAVIGATE_EVENT));
      setOverlay({ x, y, r, phase: "cover", seed: Math.floor(Math.random() * 1e9) });
      window.setTimeout(() => router.push(href), PAGE_TRANSITION.routeChangeMs);
    },
    [pathname, reduced, router, overlay],
  );

  // La nouvelle route est là : le ballon éclate.
  useEffect(() => {
    if (overlay?.phase === "cover" && target.current === pathname) {
      // Laisse le temps au ballon de finir de couvrir l'écran.
      const t = window.setTimeout(() => setOverlay((o) => (o ? { ...o, phase: "pop" } : o)), 30);
      return () => window.clearTimeout(t);
    }
  }, [pathname, overlay?.phase]);

  // Filet de sécurité : jamais d'écran bloqué sous le ballon.
  useEffect(() => {
    if (!overlay) return;
    const t = window.setTimeout(() => setOverlay(null), 4000);
    return () => window.clearTimeout(t);
  }, [overlay]);

  return (
    <Ctx.Provider value={{ navigate }}>
      {children}
      <AnimatePresence>
        {overlay?.phase === "cover" && (
          <m.div
            key="balloon"
            aria-hidden
            className="pointer-events-none fixed z-[90] rounded-full shadow-[inset_-30px_-40px_80px_rgba(16,31,43,.35)]"
            style={{
              left: overlay.x - overlay.r,
              top: overlay.y - overlay.r,
              width: overlay.r * 2,
              height: overlay.r * 2,
              background: BALLOON_BG,
            }}
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.06, 1] }}
            exit={{ scale: 1.08, opacity: 0, transition: { duration: 0.06 } }}
            transition={{ duration: COVER_S, ease: EASE_IN_OUT, times: [0, 0.82, 1] }}
          />
        )}
      </AnimatePresence>
      {overlay?.phase === "pop" && (
        <Burst x={overlay.x} y={overlay.y} r={overlay.r} seed={overlay.seed} onDone={() => setOverlay(null)} />
      )}
    </Ctx.Provider>
  );
}

export function usePageTransition() {
  return useContext(Ctx);
}

/** next/link avec la transition ballon. Ctrl/Cmd-clic, nouvel onglet : comportement natif. */
export function TransitionLink({ href, onClick, ...props }: ComponentProps<typeof Link> & { href: string }) {
  const ctx = usePageTransition();
  function handle(e: MouseEvent<HTMLAnchorElement>) {
    onClick?.(e);
    if (
      !ctx ||
      e.defaultPrevented ||
      e.button !== 0 ||
      e.metaKey ||
      e.ctrlKey ||
      e.shiftKey ||
      e.altKey ||
      props.target === "_blank"
    )
      return;
    e.preventDefault();
    // Activation clavier (detail = 0) : on part du centre de l'élément.
    let from: Point = { x: e.clientX, y: e.clientY };
    if (e.detail === 0) {
      const r = e.currentTarget.getBoundingClientRect();
      from = { x: r.left + r.width / 2, y: r.top + r.height / 2 };
    }
    ctx.navigate(href, from);
  }
  return <Link href={href} onClick={handle} {...props} />;
}
