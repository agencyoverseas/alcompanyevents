import { MapPin, MessageCircle, Phone } from "lucide-react";
import { site, telHref } from "@/content/site";
import { Container } from "@/components/ui/Section";
import { Logo } from "./Logo";
import { NAV_LINKS } from "@/content/nav";
import { TransitionLink } from "./PageTransition";

export function Footer() {
  return (
    <footer className="relative border-t border-night-3 bg-night pb-28 pt-16 sm:pb-16">
      <Container className="grid gap-12 md:grid-cols-[1.3fr_1fr_1fr]">
        <div>
          <Logo height={46} />
          <p className="mt-5 max-w-sm text-sm text-muted-d">
            Décoration et organisation d&apos;événements clé en main en Guadeloupe, depuis juillet 2023.
          </p>
          <ul className="mt-5 space-y-1 text-sm text-muted-d">
            {site.credentials.map((c) => (
              <li key={c}>— {c}</li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="smallcaps text-gold-l">Contact</h2>
          <ul className="mt-5 space-y-3 text-sm">
            <li>
              <a href={telHref} className="inline-flex items-center gap-2 text-light/85 hover:text-gold-l">
                <Phone className="size-4" aria-hidden /> {site.phoneDisplay}
              </a>
            </li>
            <li>
              <a
                href={site.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-light/85 hover:text-gold-l"
              >
                <MessageCircle className="size-4" aria-hidden /> WhatsApp
                <span className="sr-only"> (nouvel onglet)</span>
              </a>
            </li>
            {site.email && (
              <li>
                <a href={`mailto:${site.email}`} className="text-light/85 hover:text-gold-l">
                  {site.email}
                </a>
              </li>
            )}
            <li className="flex items-start gap-2 text-muted-d">
              <MapPin className="mt-0.5 size-4 shrink-0" aria-hidden />
              {site.areaServed.join(" · ")}
            </li>
          </ul>
        </div>

        <nav aria-label="Pied de page">
          <h2 className="smallcaps text-gold-l">Navigation</h2>
          <ul className="mt-5 space-y-3 text-sm">
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <TransitionLink href={l.href} className="text-light/85 hover:text-gold-l">
                  {l.label}
                </TransitionLink>
              </li>
            ))}
            <li>
              <TransitionLink href="/#devis" className="text-light/85 hover:text-gold-l">
                Demander un devis
              </TransitionLink>
            </li>
          </ul>
        </nav>
      </Container>
      <Container className="mt-14 border-t border-night-3 pt-6 text-xs text-muted-d">
        © {site.name} — Guadeloupe
      </Container>
    </footer>
  );
}
