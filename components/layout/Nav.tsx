"use client";

import { usePathname } from "next/navigation";
import { NAV_LINKS } from "@/content/nav";
import { cn } from "@/lib/utils";
import { TransitionLink } from "./PageTransition";


export function Nav({
  className,
  linkClassName,
  onNavigate,
}: {
  className?: string;
  linkClassName?: string;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  return (
    <ul className={className}>
      {NAV_LINKS.map((l) => {
        const active = pathname === l.href;
        return (
          <li key={l.href}>
            <TransitionLink
              href={l.href}
              aria-current={active ? "page" : undefined}
              onClick={onNavigate}
              className={cn(
                "relative transition-colors hover:text-gold-l",
                active ? "text-gold-l" : "text-light/80",
                linkClassName,
              )}
            >
              {l.label}
            </TransitionLink>
          </li>
        );
      })}
    </ul>
  );
}
