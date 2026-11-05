"use client";

import { Volume2, VolumeX } from "lucide-react";
import { createContext, useCallback, useContext, useEffect, useRef, useSyncExternalStore } from "react";

// Son : désactivé par défaut, jamais d'autoplay, jamais de son au chargement.
// Aucun fichier audio fourni : ambiance et sons d'interface synthétisés en Web Audio.
// L'AudioContext n'est créé qu'après un geste de la visiteuse.

const KEY = "alc-sound";

const read = () => {
  try {
    return window.localStorage.getItem(KEY) === "on";
  } catch {
    return false;
  }
};
// Repli en mémoire si localStorage est indisponible (navigation privée, etc.).
let memory = false;
const CHANGE = "alc:sound";
const write = (on: boolean) => {
  memory = on;
  try {
    window.localStorage.setItem(KEY, on ? "on" : "off");
  } catch {
    /* stockage indisponible : on garde l'état en mémoire */
  }
  window.dispatchEvent(new Event(CHANGE));
};
const subscribe = (cb: () => void) => {
  window.addEventListener(CHANGE, cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(CHANGE, cb);
    window.removeEventListener("storage", cb);
  };
};
const snapshot = () => read() || memory;

type Engine = { ctx: AudioContext; master: GainNode; stopAmbient: () => void };

function createEngine(): Engine {
  const ctx = new AudioContext();
  const master = ctx.createGain();
  master.gain.value = 0;
  master.connect(ctx.destination);
  master.gain.linearRampToValueAtTime(0.9, ctx.currentTime + 1.5);

  // Nappe douce : accord majeur grave, filtré, avec un lent trémolo.
  const filter = ctx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 700;
  const pad = ctx.createGain();
  pad.gain.value = 0.035;
  filter.connect(pad).connect(master);
  const lfo = ctx.createOscillator();
  const lfoGain = ctx.createGain();
  lfo.frequency.value = 0.08;
  lfoGain.gain.value = 0.012;
  lfo.connect(lfoGain).connect(pad.gain);
  lfo.start();
  const oscs = [130.81, 164.81, 196, 261.63].map((f, i) => {
    const o = ctx.createOscillator();
    o.type = i % 2 ? "triangle" : "sine";
    o.frequency.value = f;
    o.detune.value = (i - 1.5) * 4;
    o.connect(filter);
    o.start();
    return o;
  });
  return {
    ctx,
    master,
    stopAmbient: () => {
      oscs.forEach((o) => o.stop());
      lfo.stop();
    },
  };
}

function blip(engine: Engine, freq: number, dur = 0.12, gain = 0.06) {
  const { ctx, master } = engine;
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.type = "sine";
  o.frequency.setValueAtTime(freq, ctx.currentTime);
  o.frequency.exponentialRampToValueAtTime(freq * 1.5, ctx.currentTime + dur);
  g.gain.setValueAtTime(0, ctx.currentTime);
  g.gain.linearRampToValueAtTime(gain, ctx.currentTime + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + dur);
  o.connect(g).connect(master);
  o.start();
  o.stop(ctx.currentTime + dur + 0.02);
}

const Ctx = createContext<{ on: boolean; toggle: () => void }>({ on: false, toggle: () => {} });
export const useSound = () => useContext(Ctx);

export function SoundProvider({ children }: { children: React.ReactNode }) {
  const on = useSyncExternalStore(subscribe, snapshot, () => false);
  const engine = useRef<Engine | null>(null);

  const start = useCallback(() => {
    if (engine.current) return;
    try {
      engine.current = createEngine();
    } catch {
      engine.current = null;
    }
  }, []);
  const stop = useCallback(() => {
    const e = engine.current;
    if (!e) return;
    engine.current = null;
    e.master.gain.cancelScheduledValues(e.ctx.currentTime);
    e.master.gain.linearRampToValueAtTime(0, e.ctx.currentTime + 0.4);
    window.setTimeout(() => {
      e.stopAmbient();
      void e.ctx.close();
    }, 450);
  }, []);

  // Préférence mémorisée : on la reprend, mais le son ne démarre qu'au premier geste.
  useEffect(() => {
    if (!read()) return;
    const arm = () => start();
    window.addEventListener("pointerdown", arm, { once: true });
    window.addEventListener("keydown", arm, { once: true });
    return () => {
      window.removeEventListener("pointerdown", arm);
      window.removeEventListener("keydown", arm);
    };
  }, [start]);

  // Sons d'interface : clic sur liens et boutons.
  useEffect(() => {
    if (!on) return;
    const onClick = (e: MouseEvent) => {
      const el = (e.target as Element | null)?.closest("a, button");
      if (el && engine.current) blip(engine.current, 520);
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [on]);

  useEffect(() => () => stop(), [stop]);

  const toggle = useCallback(() => {
    const next = !on;
    write(next);
    if (next) start();
    else stop();
  }, [on, start, stop]);

  return <Ctx.Provider value={{ on, toggle }}>{children}</Ctx.Provider>;
}

export function SoundToggle() {
  const { on, toggle } = useSound();
  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={on}
      aria-label={on ? "Couper le son" : "Activer le son d'ambiance"}
      className="grid size-11 place-items-center rounded-full border border-line bg-white/90 text-muted backdrop-blur transition-colors hover:text-terra-d"
    >
      {on ? <Volume2 className="size-4" aria-hidden /> : <VolumeX className="size-4" aria-hidden />}
    </button>
  );
}
