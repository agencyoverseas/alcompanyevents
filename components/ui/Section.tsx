import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Reveal } from "./Reveal";

export function Container({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("mx-auto w-full max-w-[1180px] px-4 sm:px-[22px]", className)} {...props} />;
}

export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={cn("smallcaps mb-3 flex items-center gap-2 text-terra-d", className)}>{children}</p>;
}

type Tone = "paper" | "sand" | "dark" | "sky";

const toneClass: Record<Tone, string> = {
  paper: "bg-paper",
  sand: "bg-sand",
  sky: "bg-sky-50",
  dark: "bg-ink text-[#EAF2F8] [--accent:var(--terra-soft)]",
};

export function Section({
  id,
  eyebrow,
  title,
  intro,
  children,
  className,
  headClassName,
  tone = "paper",
  ...props
}: Omit<ComponentProps<"section">, "title"> & {
  eyebrow?: string;
  title?: ReactNode;
  intro?: ReactNode;
  headClassName?: string;
  tone?: Tone;
}) {
  const dark = tone === "dark";
  return (
    <section id={id} className={cn("relative scroll-mt-24 py-14 sm:py-[76px]", toneClass[tone], className)} {...props}>
      <Container>
        {(eyebrow || title) && (
          <Reveal className={cn("mb-8 max-w-[64ch] sm:mb-[34px]", headClassName)}>
            {eyebrow && <Eyebrow className={dark ? "text-terra-soft" : undefined}>{eyebrow}</Eyebrow>}
            {title && <h2 className={cn("h2-display", dark ? "text-white" : "text-ink")}>{title}</h2>}
            {intro && <p className={cn("mt-4 text-[1.05rem]", dark ? "text-muted-dark" : "text-muted")}>{intro}</p>}
          </Reveal>
        )}
        {children}
      </Container>
    </section>
  );
}
