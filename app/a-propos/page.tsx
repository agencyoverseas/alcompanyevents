import Image from "next/image";
import { about, story } from "@/content/apropos";
import { ButtonLink } from "@/components/ui/Button";
import { CtaBand } from "@/components/ui/CtaBand";
import { PageHeader } from "@/components/ui/PageHeader";
import { Section } from "@/components/ui/Section";
import { CTA } from "@/content/nav";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "À propos : Audrey, designer événementiel certifiée",
  description:
    "Audrey.L Company, agence de décoration et d'organisation événementielle fondée en juillet 2023 en Guadeloupe par Audrey, designer événementiel certifiée et formée à l'art de la table.",
  path: "/a-propos",
});

export default function AProposPage() {
  return (
    <>
      <PageHeader
        eyebrow="À propos"
        title={
          <>
            Je suis <span className="text-terra-d">Audrey</span>
          </>
        }
        intro={
          <>
            <p>
              J&apos;ai créé Audrey.L Company en {about.founded}, en Guadeloupe. Designer événementiel certifiée et
              formée à la maîtrise de l&apos;art de la table, j&apos;accompagne particuliers et entreprises de
              l&apos;idée au démontage.
            </p>
            {story.map((p) => (
              <p key={p} className="mt-4">
                {p}
              </p>
            ))}
            <p className="mt-4">{about.promise}</p>
          </>
        }
      >
        <ButtonLink href={CTA.href} className="mt-6">
          {CTA.main}
        </ButtonLink>
      </PageHeader>

      <Section tone="paper" className="pt-2">
        <div className="grid items-center gap-8 md:grid-cols-[1fr_1.1fr]">
          {/* ⚠️ Portrait professionnel d'Audrey à fournir : la mascotte en attendant. */}
          <div className="relative mx-auto aspect-[816/1400] w-full max-w-[320px]">
            <Image src="/scene/mascot.webp" alt="Audrey, en personnage 3D, dans son fauteuil" fill sizes="320px" className="object-contain" />
          </div>
          <dl className="grid grid-cols-2 gap-3">
            {[
              ["2023", "Création de l'agence"],
              [String(about.credentials.length), "Certifications"],
              [String(about.islands), "Îles couvertes"],
              ["A à Z", "De la scénographie à la coordination"],
            ].map(([v, l]) => (
              <div key={l} className="rounded-[20px] bg-ink px-5 py-6 text-white">
                <dt className="sr-only">{l}</dt>
                <dd className="font-display text-[1.9rem] font-black">{v}</dd>
                <dd className="mt-1 text-[0.72rem] uppercase tracking-[0.12em] text-muted-dark">{l}</dd>
              </div>
            ))}
            <div className="col-span-2 rounded-[20px] border border-line bg-white p-5 text-[0.9rem] text-muted">
              {about.credentials.join(" · ")}
            </div>
          </dl>
        </div>
      </Section>
      <CtaBand />
    </>
  );
}
