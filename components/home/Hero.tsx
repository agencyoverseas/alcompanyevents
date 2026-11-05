"use client";

import dynamic from "next/dynamic";
import { ArrowDown, Phone } from "lucide-react";
import { Fragment, useCallback, useLayoutEffect, useRef } from "react";
import { CTA } from "@/content/nav";
import { site, telHref } from "@/content/site";
import { formatPrice, lowestPrice } from "@/content/formules";
import { ButtonLink } from "@/components/ui/Button";
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
  const barRef = useRef<HTMLSpanElement>(null);
  const pctRef = useRef<HTMLSpanElement>(null);

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

  const onProgress = useCallback((p: number) => {
    if (barRef.current) barRef.current.style.transform = `scaleX(${p / 100})`;
    if (pctRef.current) pctRef.current.textContent = `${Math.round(p)} %`;
  }, []);

  let w = 0;
  const word = (text: string, accent = false) => {
    const i = w++;
    return (
      <Fragment key={`${text}-${i}`}>
        <span className="word-mask">
          <span
            className={`hero-seq seq-word inline-block ${accent ? "text-terra-soft" : ""}`}
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
        className="relative bg-paper px-4 pb-6 pt-[82px] sm:px-[22px] md:h-[100svh] md:min-h-[640px] md:pb-5"
      >
        <div className="bg-hero relative isolate mx-auto flex h-full max-w-[1180px] flex-col overflow-hidden rounded-[34px] text-white">
          {/* Filigrane + halos (étape 1 de la séquence) */}
          <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
            <div
              className="hero-seq seq-fade absolute left-1/2 top-[14%] -translate-x-1/2 whitespace-nowrap font-display text-[clamp(5rem,15vw,12.5rem)] font-black uppercase leading-[.8] tracking-[-0.04em] text-white/[.11]"
              style={d(S.halos)}
            >
              Events
            </div>
            <div
              className="hero-seq seq-fade absolute -right-[8%] top-[10%] h-[70%] w-[55%] rounded-full [background:radial-gradient(closest-side,rgba(255,255,255,.16),transparent)]"
              style={d(S.halos + 0.1)}
            />
            <div
              className="hero-seq seq-fade absolute -bottom-[25%] -left-[10%] h-[60%] w-[45%] rounded-full [background:radial-gradient(closest-side,rgba(194,100,62,.32),transparent)]"
              style={d(S.halos + 0.2)}
            />
            <div className="hero-seq seq-unveil absolute inset-0 bg-sky-800" style={d(S.bgLight)} />
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

          <div className="pointer-events-none relative z-10 flex h-full flex-col px-6 pt-9 sm:px-11 md:flex-row md:items-center md:pt-0">
            <div
              ref={copyRef}
              className="hero-copy pointer-events-auto relative flex flex-col pb-6 md:w-[54%] md:pb-0 lg:w-[52%]"
            >
              <div className="hero-seq seq-fade-up" style={d(S.logo)}>
                <span className="mb-5 inline-flex items-center gap-2 rounded-full bg-terra-d py-[7px] pl-2 pr-4 text-[0.78rem] font-medium text-white">
                  <span aria-hidden className="grid size-5 place-items-center rounded-full bg-white/25 text-[0.7rem]">
                    ✦
                  </span>
                  Guadeloupe &amp; îles alentours · depuis 2023
                </span>
              </div>

              <h1 id="hero-title" className="h1-display text-white">
                <span className="block">{LINE_1.map((t) => word(t))}</span>
                <span className="block">{LINE_2.map((t) => word(t, true))}</span>
              </h1>

              <p
                className="hero-seq seq-fade-up mt-4 max-w-[44ch] font-display text-[clamp(1.05rem,2.1vw,1.35rem)] font-light text-white/90"
                style={d(S.subtitle)}
              >
                De la première idée au démontage, chaque détail vous est épargné.
              </p>
              <p className="hero-seq seq-fade-up mt-2 max-w-[46ch] text-[0.95rem] text-white/85" style={d(S.subtitle + 0.05)}>
                Décoration, scénographie, organisation et coordination d&apos;événements privés et professionnels en
                Guadeloupe et dans les îles alentours.
              </p>

              <div className="hero-seq seq-fade-up mt-6 flex flex-wrap gap-2.5" style={d(S.buttons)}>
                <ButtonLink href={CTA.href} variant="light" size="lg">
                  {CTA.main}
                </ButtonLink>
                <ButtonLink href="/formules" variant="ghostLight" size="lg">
                  Découvrir nos formules
                </ButtonLink>
              </div>

              <div
                className="hero-seq seq-fade mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-[0.78rem] text-white/85"
                style={d(S.buttons + 0.1)}
              >
                <a href={telHref} className="inline-flex items-center gap-1.5 font-medium hover:text-white">
                  <Phone className="size-3.5" aria-hidden /> {site.phoneDisplay}
                </a>
                <TransitionLink href="/formules" className="font-medium underline-offset-4 hover:underline">
                  Formules dès {formatPrice(lowestPrice)}
                </TransitionLink>
              </div>
            </div>

            {/* Visuel statique (mobile / sans 3D). Sur bureau avec 3D, sert d'espaceur. */}
            <div className="relative -mx-6 mt-2 h-[min(46svh,420px)] shrink-0 sm:-mx-11 md:mx-0 md:mt-0 md:h-full md:flex-1">
              <MobileHero />
            </div>
          </div>

          {/* Indicateur de scroll discret */}
          <div ref={cueRef} aria-hidden className="absolute bottom-5 left-1/2 z-10 hidden -translate-x-1/2 md:block">
            <div className="hero-seq seq-fade flex flex-col items-center gap-2" style={d(S.cue)}>
              <span className="smallcaps text-white/75">Défiler</span>
              <span className="relative block h-9 w-px overflow-hidden bg-white/25">
                <span className="absolute inset-x-0 top-0 h-1/3 bg-white [animation:scroll-cue_1.8s_cubic-bezier(.65,0,.35,1)_infinite]" />
              </span>
            </div>
          </div>

          {/* Le bloc suivant arrive par-dessous pendant le pin (bureau + 3D uniquement) */}
          {canScene && (
            <div
              ref={teaserRef}
              aria-hidden
              className="pointer-events-none invisible absolute inset-x-0 bottom-0 z-20 opacity-0"
            >
              <div className="flex items-end justify-between bg-paper px-11 py-7 text-ink">
                <p className="h2-display">Des fêtes qu&apos;on n&apos;oublie pas</p>
                <ArrowDown className="mb-2 size-5 text-terra-d" />
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
