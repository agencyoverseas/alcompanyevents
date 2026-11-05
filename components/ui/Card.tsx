import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export function Card({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn("rounded-[10px] border border-night-3 bg-night-2 text-light", className)}
      {...props}
    />
  );
}
