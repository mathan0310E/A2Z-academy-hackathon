import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * shadcn/ui Button, tuned to the A2Z Academy reference site.
 *
 * Two details from the reference are deliberate and easy to "fix" by mistake:
 *  - the base radius is `rounded-lg` (= `var(--radius)`); the pill shape is layered on by the
 *    `.btn-pill*` classes and their `rounded-full` utility (tailwind-merge drops the
 *    conflicting base value).
 *  - the primary foreground is near-black (#1a1a1a) on green, not white —
 *    white on #71bf43 fails contrast.
 *
 * Pill sizes use a 1.5rem horizontal pad and a 2.5rem height, matching the
 * reference's `h-10 px-6` CTAs.
 */
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline:
          "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        /**
         * Brand pills. `rounded-full` and `font-bold` are repeated as utilities
         * because the base sets `rounded-lg` and `font-medium`; `cn`/
         * tailwind-merge resolves those conflicts in favour of the variant.
         */
        pill: "btn-pill btn-pill-primary rounded-full font-bold",
        /** Brand pill — outlined, matches the reference's secondary CTA. */
        pillOutline: "btn-pill btn-pill-outline rounded-full font-bold",
        /** Brand pill — navy. */
        pillNavy: "btn-pill btn-pill-navy rounded-full font-bold",
      },
      size: {
        default: "h-9 px-3 sm:h-10 sm:px-4",
        sm: "h-8 px-3",
        lg: "h-11 px-8",
        icon: "h-9 w-9",
        pill: "h-10 px-6",
        pillLg: "h-11 px-6",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
