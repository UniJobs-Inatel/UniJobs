import * as React from "react";

import { cn } from "@/lib/utils";
import { Label } from "./label";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
  label?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, label ,...props }, ref) => {
    return (
      <div className="w-full">
        <Label
          className="font-medium text-[14px] text-primary"
          htmlFor={props.id}
        >
          {label}
        </Label>
        <textarea
          className={cn(
            "flex min-h-[80px] w-full rounded-md border border-primary px-3 py-2 text-sm  focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
          ref={ref}
          {...props}
        />
        {error && <p className="mt-1 text-[10px] text-red-500">{error}</p>}
      </div>
    );
  }
);
Textarea.displayName = "Textarea";

export { Textarea };

