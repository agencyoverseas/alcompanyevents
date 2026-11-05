import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";
import { TransitionLink } from "@/components/layout/PageTransition";

export const buttonVariants = cva(
  "btn-label inline-flex items-center justify-center gap-2 rounded-full transition-[transform,background-color,border-color,color,filter] duration-200 select-none disabled:pointer-events-none disabled:opacity-50 active:translate-y-px whitespace-nowrap",
  {
    variants: {
      variant: {
        primary: "bg-ink text-white hover:bg-ink-soft",
        terra: "bg-terra-d text-white hover:brightness-110",
        outline: "border border-sky-200 text-ink hover:bg-sky-50",
        /** Sur fond bleu ou sombre */
        light: "bg-white text-ink hover:bg-sky-50",
        ghostLight: "border border-white/45 text-white hover:bg-white/12",
      },
      size: {
        sm: "h-10 px-[18px] text-[0.82rem]",
        md: "h-12 px-6",
        lg: "h-[52px] px-7",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

type Variant = VariantProps<typeof buttonVariants>;

export function Button({ className, variant, size, ...props }: ComponentProps<"button"> & Variant) {
  return <button className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}

/** Lien stylé en bouton. Liens internes → transition ballon ; externes / tel: → <a>. */
export function ButtonLink({
  href,
  className,
  variant,
  size,
  ...props
}: Omit<ComponentProps<"a">, "href"> & Variant & { href: string }) {
  const classes = cn(buttonVariants({ variant, size }), className);
  if (href.startsWith("/")) {
    return <TransitionLink href={href} className={classes} {...props} />;
  }
  return <a href={href} className={classes} {...props} />;
}
