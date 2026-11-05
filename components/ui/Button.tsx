import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";
import { TransitionLink } from "@/components/layout/PageTransition";

export const buttonVariants = cva(
  "btn-label inline-flex items-center justify-center gap-2.5 rounded-[10px] transition-[transform,opacity,background-color,border-color,color] duration-200 select-none disabled:pointer-events-none disabled:opacity-50 active:translate-y-px whitespace-nowrap",
  {
    variants: {
      variant: {
        primary: "bg-gold-gradient text-ink hover:opacity-90",
        outline: "border border-gold/70 text-gold-l hover:border-gold-l hover:bg-gold/10",
        ghost: "text-gold-l hover:bg-gold/10",
        light: "bg-light text-ink hover:bg-white",
      },
      size: {
        md: "h-12 px-6",
        lg: "h-14 px-8",
        sm: "h-10 px-4",
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
