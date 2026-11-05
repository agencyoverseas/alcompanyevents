"use client";

import { usePathname } from "next/navigation";
import { NAV_LINKS } from "@/content/nav";
import { cn } from "@/lib/utils";
import { TransitionLink } from "./PageTransition";

export function Nav({
  className,
  linkClassName,
  activeClassName,
  onNavigate,
}: {
  className?: string;
  linkClassName?: string;
  activeClassName?: string;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  return (
    <ul className={className}>
      {NAV_LINKS.map((l) => {
        const active = l.href === "/" ? pathname === "/" : pathname.startsWith(l.href);
        return (
          <li key={l.href}>
            <TransitionLink
              href={l.href}
              aria-current={active ? "page" : undefined}
              onClick={onNavigate}
              className={cn(linkClassName, active && activeClassName)}
            >
              {l.label}
            </TransitionLink>
          </li>
        );
      })}
    </ul>
  );
}
