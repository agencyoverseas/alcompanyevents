"use client";

import { AnimatePresence, m } from "motion/react";
import { Menu, Phone, X } from "lucide-react";
import { useEffect, useLayoutEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { site, telHref } from "@/content/site";
import { ButtonLink } from "@/components/ui/Button";
import { fade } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { Logo } from "./Logo";
import { Nav } from "./Nav";
import { TransitionLink } from "./PageTransition";

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Ferme le menu à chaque navigation.
  useLayoutEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-[60] transition-[background-color,border-color] duration-300",
        scrolled || open
          ? "border-b border-night-3/80 bg-night/85 backdrop-blur-md"
          : "border-b border-transparent",
      )}
    >
      <a
        href="#contenu"
        className="btn-label sr-only z-[70] rounded-[10px] bg-gold px-4 py-3 text-ink focus:not-sr-only focus:absolute focus:left-4 focus:top-3"
      >
        Aller au contenu
      </a>
      <div className="mx-auto flex h-16 max-w-[1240px] items-center justify-between px-4 sm:h-20 sm:px-6 lg:px-10">
        <TransitionLink href="/" aria-label="Audrey.L Company — accueil" className="shrink-0">
          <Logo height={34} preload />
        </TransitionLink>

        <nav aria-label="Navigation principale" className="hidden md:block">
          <Nav className="flex items-center gap-9 text-sm font-medium" />
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <a
            href={telHref}
            className="flex items-center gap-2 text-sm text-light/80 transition-colors hover:text-gold-l"
          >
            <Phone className="size-4" aria-hidden />
            {site.phoneDisplay}
          </a>
          <ButtonLink href="/#devis" size="sm">
            Demander un devis
          </ButtonLink>
        </div>

        <button
          type="button"
          className="grid size-11 place-items-center rounded-[10px] text-light md:hidden"
          aria-expanded={open}
          aria-controls="menu-mobile"
          aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <X className="size-5" aria-hidden /> : <Menu className="size-5" aria-hidden />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <m.nav
            id="menu-mobile"
            aria-label="Navigation mobile"
            variants={fade}
            initial="hidden"
            animate="show"
            exit="hidden"
            className="fixed inset-x-0 bottom-0 top-16 flex flex-col justify-between bg-night px-6 pb-10 pt-8 md:hidden"
          >
            <Nav
              className="flex flex-col gap-6"
              linkClassName="font-display text-4xl"
              onNavigate={() => setOpen(false)}
            />
            <div className="flex flex-col gap-3">
              <ButtonLink href="/#devis" size="lg" onClick={() => setOpen(false)}>
                Demander un devis
              </ButtonLink>
              <ButtonLink href={telHref} variant="outline" size="lg">
                <Phone className="size-4" aria-hidden /> Appeler {site.phoneDisplay}
              </ButtonLink>
            </div>
          </m.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
