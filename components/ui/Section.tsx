import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Reveal } from "./Reveal";

export function Container({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("mx-auto w-full max-w-[1240px] px-4 sm:px-6 lg:px-10", className)} {...props} />;
}

export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p className={cn("smallcaps flex items-center gap-3 text-gold-l", className)}>
      <span aria-hidden className="h-px w-8 bg-gold" />
      {children}
    </p>
  );
}

export function Section({
  id,
  eyebrow,
  title,
  intro,
  children,
  className,
  headClassName,
  ...props
}: Omit<ComponentProps<"section">, "title"> & {
  eyebrow?: string;
  title?: ReactNode;
  intro?: ReactNode;
  headClassName?: string;
}) {
  return (
    <section id={id} className={cn("relative py-20 sm:py-28", className)} {...props}>
      <Container>
        {(eyebrow || title) && (
          <Reveal className={cn("mb-10 max-w-2xl sm:mb-14", headClassName)}>
            {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
            {title && <h2 className="h2-display mt-4 text-light">{title}</h2>}
            {intro && <p className="mt-4 text-muted-d">{intro}</p>}
          </Reveal>
        )}
        {children}
      </Container>
    </section>
  );
}
