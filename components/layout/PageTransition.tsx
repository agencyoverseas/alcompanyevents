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
type Overlay = { x: number; y: number; r: number; phase: "cover" | "reveal" } | null;

/** Lu par app/template.tsx : vrai dès la première navigation client. */
export const navState = { navigated: false };

const Ctx = createContext<{ navigate: (href: string, from?: Point) => void } | null>(null);

const COVER_S = PAGE_TRANSITION.routeChangeMs / 1000; // 0,42 s
const REVEAL_S = (PAGE_TRANSITION.totalMs - PAGE_TRANSITION.routeChangeMs) / 1000; // 0,48 s

const pathOf = (href: string) => new URL(href, "https://x.local").pathname;

/**
 * Transition « ballon » : un cercle terracotta part du point cliqué, couvre l'écran
 * (420 ms), la route change, puis le cercle se rétracte sur la nouvelle page (480 ms).
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
      setOverlay({ x, y, r, phase: "cover" });
      window.setTimeout(() => router.push(href), PAGE_TRANSITION.routeChangeMs);
    },
    [pathname, reduced, router, overlay],
  );

  // La nouvelle route est là : on rétracte le ballon.
  useEffect(() => {
    if (overlay?.phase === "cover" && target.current === pathname) {
      // Laisse le temps au cercle de finir de couvrir l'écran.
      const t = window.setTimeout(() => setOverlay((o) => (o ? { ...o, phase: "reveal" } : o)), 30);
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
        {overlay && (
          <m.div
            key="balloon"
            aria-hidden
            className="pointer-events-none fixed z-[90] rounded-full"
            style={{
              left: overlay.x - overlay.r,
              top: overlay.y - overlay.r,
              width: overlay.r * 2,
              height: overlay.r * 2,
              background:
                "radial-gradient(circle at 34% 30%, #d07a58 0%, #b45a3c 38%, #963c1e 100%)",
            }}
            initial={{ scale: 0 }}
            animate={{ scale: overlay.phase === "cover" ? 1 : 0 }}
            transition={
              overlay.phase === "cover"
                ? { duration: COVER_S, ease: EASE_IN_OUT }
                : { duration: REVEAL_S, ease: EASE_OUT }
            }
            onAnimationComplete={() => {
              if (overlay.phase === "reveal") setOverlay(null);
            }}
          />
        )}
      </AnimatePresence>
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
