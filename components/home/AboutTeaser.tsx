import { about } from "@/content/apropos";
import { ButtonLink } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";

export function AboutTeaser() {
  return (
    <Section tone="paper">
      <Reveal className="grid items-center gap-8 rounded-[34px] border border-line bg-white p-6 sm:p-10 md:grid-cols-[1.2fr_1fr]">
        <div>
          <p className="smallcaps mb-3 text-terra-d">Audrey</p>
          <h2 className="h2-display text-ink">
            Bien plus que de la <em>décoration</em>
          </h2>
          <p className="mt-4 text-[1.05rem] text-muted">{about.promise}</p>
          <ButtonLink href="/a-propos" variant="outline" className="mt-6">
            En savoir plus
          </ButtonLink>
        </div>
        <dl className="grid grid-cols-3 gap-3 text-center">
          {[
            ["2023", "Création de l'agence"],
            [String(about.credentials.length), "Certifications"],
            [String(about.islands), "Îles couvertes"],
          ].map(([v, l]) => (
            <div key={l} className="rounded-[20px] bg-sky-50 px-2 py-5">
              <dt className="sr-only">{l}</dt>
              <dd className="font-display text-[1.75rem] font-black text-sky-800">{v}</dd>
              <dd className="mt-1 text-[0.62rem] uppercase leading-tight tracking-[0.06em] text-muted">{l}</dd>
            </div>
          ))}
        </dl>
      </Reveal>
    </Section>
  );
}
