import type { ReactNode } from "react";
import { Container, Eyebrow } from "./Section";
import { Reveal } from "./Reveal";

export function PageHeader({
  eyebrow,
  title,
  intro,
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  intro?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden pb-8 pt-28 sm:pb-10 sm:pt-32">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-40 -top-40 size-[34rem] rounded-full [background:radial-gradient(circle,rgba(111,170,211,.2),transparent_65%)]"
      />
      <Container>
        <Reveal className="relative max-w-3xl">
          <Eyebrow>{eyebrow}</Eyebrow>
          <h1 className="h1-display text-ink">{title}</h1>
          {intro && <div className="mt-5 max-w-[60ch] text-[1.05rem] text-muted">{intro}</div>}
          {children}
        </Reveal>
      </Container>
    </section>
  );
}
