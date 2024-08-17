import * as React from "react";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const cardVariants = cva(
  "flex flex-col p-4 border rounded-lg shadow-sm transition-shadow hover:shadow-md",
  {
    variants: {
      variant: {
        default: "bg-white border-gray-200",
        outlined: "bg-white border border-gray-300",
        elevated: "bg-white border border-gray-200 shadow-lg",
      },
      size: {
        default: "w-full max-w-sm",
        sm: "w-full max-w-xs",
        lg: "w-full max-w-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  asChild?: boolean;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? "div" : "div";
    return (
      <Comp
        className={cn(cardVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);

Card.displayName = "Card";

export { Card, cardVariants };
