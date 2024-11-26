import * as React from "react";
import { cn } from "@/lib/cn";
import { Label } from "@radix-ui/react-label";
import InputMask from "react-input-mask";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  mask?: string;
  error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, mask, error,...props }, ref) => {
    return (
      <div className="w-full">
        <Label
          className="font-medium text-[14px] "
          htmlFor={props.id}
        >
          {label}
        </Label>
        {mask ? (
          <InputMask
            mask={mask || ""}
            maskChar={null}
            alwaysShowMask={false}
            className={cn(
              "flex h-10 w-full rounded-md border border-primary -900 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
              className
            )}
            {...props}
          />
        ) : (
          <input
            type={type}
            className={cn(
              "flex h-10 w-full rounded-md border border-primary -900 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
              className
            )}
            ref={ref}
            {...props}
          />
        )}
        {error && <p data-cy='error-message' className="mt-1 text-[12px] text-red-500">{error}</p>}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };

