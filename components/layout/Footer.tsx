import { CTA } from "@/content/nav";
import { families } from "@/content/formules";
import { site, telHref } from "@/content/site";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Section";
import { Logo } from "./Logo";
import { TransitionLink } from "./PageTransition";

const link = "block py-[3px] text-muted-dark transition-colors hover:text-white";

export function Footer() {
  return (
    <footer className="bg-ink pb-28 pt-[60px] text-[0.85rem] text-muted-dark sm:pb-8">
      <Container>
        <div className="mb-10 grid gap-9 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1.3fr]">
          <div>
            <Logo tone="light" />
            <p className="mt-4">Célébrez, on s&apos;occupe du reste.</p>
            <p className="mt-3 text-[0.8rem]">
              Agence de décoration et d&apos;organisation événementielle — {site.areaServed.join(", ")}.
            </p>
            <ButtonLink href={CTA.href} variant="terra" size="sm" className="mt-5">
              {CTA.main}
            </ButtonLink>
          </div>
          <nav aria-label="Formules">
            <h2 className="mb-3 font-display text-[0.95rem] font-semibold uppercase tracking-[0.08em] text-white">
              Formules
            </h2>
            {families.map((f) => (
              <TransitionLink key={f.id} href={`/formules#${f.id}`} className={link}>
                {f.name}
              </TransitionLink>
            ))}
            <TransitionLink href="/mariage" className={link}>
              Mariage
            </TransitionLink>
            <TransitionLink href="/anniversaire-enfant" className={link}>
              Anniversaire enfant en Guadeloupe
            </TransitionLink>
          </nav>
          <nav aria-label="L'agence">
            <h2 className="mb-3 font-display text-[0.95rem] font-semibold uppercase tracking-[0.08em] text-white">
              L&apos;agence
            </h2>
            {[
              ["/prestations", "Prestations"],
              ["/realisations", "Réalisations"],
              ["/comment-ca-se-passe", "Comment ça se passe"],
              ["/a-propos", "À propos"],
              ["/faq", "FAQ"],
              ["/journal", "Journal"],
            ].map(([href, label]) => (
              <TransitionLink key={href} href={href} className={link}>
                {label}
              </TransitionLink>
            ))}
          </nav>
          <div>
            <h2 className="mb-3 font-display text-[0.95rem] font-semibold uppercase tracking-[0.08em] text-white">
              Contact
            </h2>
            <a href={telHref} className={link}>
              {site.phoneDisplay}
            </a>
            {site.email && (
              <a href={`mailto:${site.email}`} className={link}>
                {site.email}
              </a>
            )}
            <a href={site.whatsapp} target="_blank" rel="noopener noreferrer" className={link}>
              WhatsApp<span className="sr-only"> (nouvel onglet)</span>
            </a>
            <TransitionLink href={CTA.href} className={link}>
              {CTA.devis}
            </TransitionLink>
          </div>
        </div>
        <div className="flex flex-wrap justify-between gap-3 border-t border-[#24404F] pt-5 text-[0.76rem]">
          <span>© {site.name} — Guadeloupe</span>
          {/* ⚠️ Mentions légales et politique de confidentialité à rédiger (SIRET, hébergeur, RGPD). */}
        </div>
      </Container>
    </footer>
  );
}
