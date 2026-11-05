import { faq } from "@/content/faq";
import { CtaBand } from "@/components/ui/CtaBand";
import { Container } from "@/components/ui/Section";
import { PageHeader } from "@/components/ui/PageHeader";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "FAQ : vos questions, nos réponses",
  description:
    "Types d'événements, tarifs, réservation, zones d'intervention : les réponses aux questions fréquentes sur Audrey.L Company, décoration et organisation d'événements en Guadeloupe.",
  path: "/faq",
});

export default function FaqPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <PageHeader
        eyebrow="FAQ"
        title={
          <>
            Vos questions, <span className="text-terra-d">nos réponses</span>
          </>
        }
      />
      <section className="pb-10">
        <Container className="max-w-[820px]">
          {faq.map((f) => (
            <details
              key={f.q}
              className="group mb-2.5 rounded-[20px] border border-line bg-white px-[22px] py-[18px] open:border-sky-400"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-[1.02rem] font-semibold text-ink [&::-webkit-details-marker]:hidden">
                {f.q}
                <span aria-hidden className="text-xl leading-none text-terra-d group-open:hidden">
                  +
                </span>
                <span aria-hidden className="hidden text-xl leading-none text-terra-d group-open:inline">
                  −
                </span>
              </summary>
              <p className="mt-3 text-[0.9rem] text-muted">{f.a}</p>
            </details>
          ))}
        </Container>
      </section>
      <CtaBand title="Une autre question ?" text="Écrivez-nous via le formulaire ou appelez-nous : on vous répond avec plaisir." />
    </>
  );
}
