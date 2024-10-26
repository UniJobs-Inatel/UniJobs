"use client";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

const buttonVariants = cva(
  "w-full h-10 lg:h-12 fill-primary text-center flex flex-row justify-center items-center rounded-lg font-bold",
  {
    variants: {
      variant: {
        primary: " bg-primary text-secondary-50 fill-secondary stroke-secondary",
        secondary: "bg-secondary text-primary fill-primary stroke-primary",
        outline:
          "border border-primary bg-white text-primary stroke-primary",
      },
    },
    defaultVariants: {
      variant: "primary",
    },
  }
);

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  prefixIcon?: React.ReactNode;
  suffixIcon?: JSX.Element;
  isLoading?: boolean;
  shadow?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      children,
      suffixIcon,
      prefixIcon,
      disabled,
      isLoading,
      shadow = false,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          buttonVariants({ variant, className }),
          disabled && "bg-jn-disabled-button",
          shadow && "shadow-lg"
        )}
        {...props}
      >
        <div className="relative flex w-full flex-row items-center justify-center gap-2 text-inherit">
          {prefixIcon}
          {children}
          {suffixIcon}
        </div>
      </button>
    );
  }
);

Button.displayName = "Button";

export { type ButtonProps, Button };
