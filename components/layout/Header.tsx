"use client";

import { AnimatePresence, m } from "motion/react";
import { Menu, Phone, X } from "lucide-react";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { CTA } from "@/content/nav";
import { site, telHref } from "@/content/site";
import { ButtonLink } from "@/components/ui/Button";
import { fade } from "@/lib/motion";
import { Logo } from "./Logo";
import { Nav } from "./Nav";
import { TransitionLink } from "./PageTransition";

export function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Ferme le menu à chaque navigation (motif « état précédent », sans effet).
  const [prevPath, setPrevPath] = useState(pathname);
  if (prevPath !== pathname) {
    setPrevPath(pathname);
    setOpen(false);
  }

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
    <header className="fixed inset-x-0 top-0 z-[60] border-b border-line bg-paper/90 backdrop-blur-md">
      <a
        href="#contenu"
        className="btn-label sr-only z-[70] rounded-full bg-ink px-4 py-3 text-white focus:not-sr-only focus:absolute focus:left-4 focus:top-3"
      >
        Aller au contenu
      </a>
      <div className="mx-auto flex h-16 max-w-[1180px] items-center gap-4 px-4 sm:px-[22px]">
        <TransitionLink href="/" aria-label="Audrey.L Company — accueil" className="shrink-0">
          <Logo />
        </TransitionLink>

        <nav aria-label="Navigation principale" className="mx-auto hidden xl:block">
          <Nav
            className="flex gap-0.5 rounded-full border border-line bg-sky-50 p-[5px]"
            linkClassName="block whitespace-nowrap rounded-full px-3.5 py-2 text-[0.82rem] font-medium text-ink-soft transition-colors hover:bg-white"
            activeClassName="bg-ink text-white hover:bg-ink"
          />
        </nav>

        <div className="ml-auto flex shrink-0 items-center gap-2.5 xl:ml-0">
          <a
            href={telHref}
            className="hidden items-center gap-1.5 text-[0.8rem] font-medium text-ink-soft hover:text-terra-d md:flex"
          >
            <Phone className="size-3.5" aria-hidden /> {site.phoneDisplay}
          </a>
          <ButtonLink href={CTA.href} size="sm" className="hidden sm:inline-flex">
            {CTA.main}
          </ButtonLink>
          <button
            type="button"
            className="grid h-[38px] w-10 place-items-center rounded-[10px] border border-sky-200 text-ink xl:hidden"
            aria-expanded={open}
            aria-controls="menu-mobile"
            aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <X className="size-5" aria-hidden /> : <Menu className="size-5" aria-hidden />}
          </button>
        </div>
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
            className="fixed inset-x-0 bottom-0 top-16 flex flex-col justify-between overflow-y-auto bg-paper px-6 pb-10 pt-6 xl:hidden"
          >
            <Nav
              className="flex flex-col gap-1"
              linkClassName="block rounded-[12px] px-3 py-3 font-display text-2xl font-semibold text-ink hover:bg-sky-50"
              activeClassName="bg-sky-50 text-terra-d"
              onNavigate={() => setOpen(false)}
            />
            <div className="mt-8 flex flex-col gap-3">
              <ButtonLink href={CTA.href} size="lg" onClick={() => setOpen(false)}>
                {CTA.main}
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
