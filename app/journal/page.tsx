import { posts } from "@/content/journal";
import { CtaBand } from "@/components/ui/CtaBand";
import { Container } from "@/components/ui/Section";
import { PageHeader } from "@/components/ui/PageHeader";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Journal : inspirations et conseils",
  description: "Inspirations, tendances et conseils pour réussir votre événement en Guadeloupe, par Audrey.L Company.",
  path: "/journal",
});

export default function JournalPage() {
  return (
    <>
      <PageHeader
        eyebrow="Journal"
        title={
          <>
            Inspirations <span className="text-terra-d">& conseils</span>
          </>
        }
      />
      <section className="pb-6">
        <Container>
          {posts.length === 0 ? (
            <p className="max-w-xl rounded-[20px] border border-dashed border-sky-200 bg-white p-6 text-muted">
              Nos premiers articles sont en préparation : idées de thèmes, coulisses de nos réalisations et conseils
              pour organiser votre événement.
            </p>
          ) : null}
        </Container>
      </section>
      <CtaBand />
    </>
  );
}
