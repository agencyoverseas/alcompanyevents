"use client";

import dynamic from "next/dynamic";
import { ArrowDown, Phone } from "lucide-react";
import { Fragment, useCallback, useLayoutEffect, useRef } from "react";
import { telHref } from "@/content/site";
import { formatPrice, lowestPrice } from "@/content/formules";
import { ButtonLink } from "@/components/ui/Button";
import { Logo } from "@/components/layout/Logo";
import { TransitionLink } from "@/components/layout/PageTransition";
import { MobileHero } from "@/components/scene/MobileHero";
import { SceneLoader } from "@/components/scene/SceneLoader";
import { HERO_SEQUENCE as S } from "@/lib/motion";
import { useCanScene } from "@/lib/useMedia";

// three.js, R3F, drei et GSAP ne sont chargés que si useCanScene() est vrai
// (≥ 768px, pointeur fin, mouvement non réduit). Jamais dans le bundle mobile.
const HeroScene = dynamic(() => import("@/components/scene/HeroScene"), { ssr: false });

const d = (s: number) => ({ ["--d" as string]: `${s}s` }) as React.CSSProperties;

const LINE_1 = ["Décoration", "&", "organisation"];
const LINE_2 = ["clé", "en", "main"];

export function Hero() {
  const canScene = useCanScene();
  const sectionRef = useRef<HTMLElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const teaserRef = useRef<HTMLDivElement>(null);
  const cueRef = useRef<HTMLDivElement>(null);

  // Navigation client vers l'accueil : le script inline n'a pas tourné, on pose
  // data-scene="pending" avant le premier paint (séquence en pause + rideau).
  useLayoutEffect(() => {
    if (!canScene) return;
    const html = document.documentElement;
    if (!html.hasAttribute("data-scene")) html.setAttribute("data-scene", "pending");
    const failsafe = window.setTimeout(() => {
      if (html.getAttribute("data-scene") === "pending") html.setAttribute("data-scene", "ready");
    }, 9000);
    return () => {
      window.clearTimeout(failsafe);
      html.removeAttribute("data-scene");
    };
  }, [canScene]);
  const barRef = useRef<HTMLSpanElement>(null);
  const pctRef = useRef<HTMLSpanElement>(null);

  const onProgress = useCallback((p: number) => {
    if (barRef.current) barRef.current.style.transform = `scaleX(${p / 100})`;
    if (pctRef.current) pctRef.current.textContent = `${Math.round(p)} %`;
  }, []);

  let w = 0;
  const word = (text: string, gold = false) => {
    const i = w++;
    return (
      <Fragment key={`${text}-${i}`}>
        <span className="word-mask">
          <span
            className={`hero-seq seq-word inline-block ${gold ? "text-gold-gradient pr-[0.04em]" : ""}`}
            style={d(S.h1Start + i * S.wordStagger)}
          >
            {text}
          </span>
        </span>{" "}
      </Fragment>
    );
  };

  return (
    <>
    <SceneLoader barRef={barRef} pctRef={pctRef} />
    <section
      ref={sectionRef}
      aria-labelledby="hero-title"
      className="relative isolate overflow-hidden bg-night md:h-[100svh] md:min-h-[640px]"
    >
      {/* Étape 1 : halos dorés + le fond qui s'éclaire */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div
          className="hero-seq seq-fade absolute -right-[10%] top-[8%] h-[70vmin] w-[70vmin] rounded-full [background:radial-gradient(circle,rgba(201,162,91,.22)_0%,transparent_65%)]"
          style={d(S.halos)}
        />
        <div
          className="hero-seq seq-fade absolute -left-[15%] bottom-[-20%] h-[60vmin] w-[60vmin] rounded-full [background:radial-gradient(circle,rgba(180,90,60,.16)_0%,transparent_65%)]"
          style={d(S.halos + 0.15)}
        />
        <div className="hero-seq seq-unveil absolute inset-0 bg-black/70" style={d(S.bgLight)} />
      </div>

      {canScene && (
        <HeroScene
          sectionRef={sectionRef}
          copyRef={copyRef}
          cueRef={cueRef}
          teaserRef={teaserRef}
          onProgress={onProgress}
        />
      )}

      <div className="pointer-events-none relative z-10 mx-auto flex min-h-[100svh] max-w-[1240px] flex-col px-4 pt-16 sm:px-6 md:min-h-0 md:h-full md:flex-row md:items-center md:pt-20 lg:px-10">
        {/* Visuel statique (mobile / sans 3D). Sur bureau avec 3D, sert d'espaceur. */}
        <div className="relative order-1 h-[min(40svh,380px)] shrink-0 md:order-2 md:h-full md:flex-1">
          <MobileHero />
        </div>

        <div
          ref={copyRef}
          className="hero-copy pointer-events-auto relative order-2 flex flex-1 flex-col justify-center pb-24 pt-2 md:order-1 md:w-[54%] md:flex-none lg:w-[58%] md:pb-0 md:pt-0"
        >
          <div className="hero-seq seq-fade-up hidden md:block" style={d(S.logo)}>
            <Logo height={52} />
          </div>

          <h1 id="hero-title" className="h1-display mt-1 text-light md:mt-8">
            <span className="block lg:whitespace-nowrap">{LINE_1.map((t) => word(t))}</span>
            <span className="block lg:whitespace-nowrap">{LINE_2.map((t) => word(t, true))}</span>
          </h1>

          <p className="hero-seq seq-fade-up mt-5 max-w-md text-[0.95rem] text-muted-d sm:text-base" style={d(S.subtitle)}>
            De la première idée au démontage, chaque détail vous est épargné. Guadeloupe et îles
            alentours, depuis 2023.
          </p>

          <div className="hero-seq seq-fade-up mt-7 flex flex-col gap-3 sm:flex-row" style={d(S.buttons)}>
            <ButtonLink href="/formules" size="lg">
              Découvrir nos formules
            </ButtonLink>
            <ButtonLink href={telHref} variant="outline" size="lg">
              <Phone className="size-4" aria-hidden /> Appeler
            </ButtonLink>
          </div>

          <div className="hero-seq seq-fade mt-6" style={d(S.buttons + 0.1)}>
            <TransitionLink
              href="/formules"
              className="smallcaps inline-flex items-center gap-2 text-gold-l underline-offset-4 hover:underline"
            >
              Formules dès {formatPrice(lowestPrice)}
            </TransitionLink>
          </div>
        </div>
      </div>

      {/* Indicateur de scroll discret */}
      <div ref={cueRef} aria-hidden className="absolute bottom-6 left-1/2 z-10 hidden -translate-x-1/2 md:block">
        <div className="hero-seq seq-fade flex flex-col items-center gap-3" style={d(S.cue)}>
          <span className="smallcaps text-muted-d">Défiler</span>
          <span className="relative block h-10 w-px overflow-hidden bg-night-3">
            <span className="absolute inset-x-0 top-0 h-1/3 bg-gold [animation:scroll-cue_1.8s_cubic-bezier(.65,0,.35,1)_infinite]" />
          </span>
        </div>
      </div>

      {/* Le bloc suivant qui arrive par-dessous pendant le pin (bureau + 3D uniquement) */}
      {canScene && (
        <div
          ref={teaserRef}
          aria-hidden
          className="pointer-events-none invisible absolute inset-x-0 bottom-0 z-20 opacity-0"
        >
          <div className="mx-auto flex max-w-[1240px] items-end justify-between border-t border-night-3 bg-night/95 px-10 py-8 backdrop-blur">
            <p className="h2-display text-light">Quatre univers, une même exigence</p>
            <ArrowDown className="mb-2 size-5 text-gold-l" />
          </div>
        </div>
      )}
    </section>
    </>
  );
}
