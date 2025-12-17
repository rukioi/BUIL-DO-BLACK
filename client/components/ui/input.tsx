import * as React from "react";

import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-xl border-2 border-[#3f3f46] bg-[#27272a] px-4 py-3 text-sm text-gray-200 placeholder:text-gray-500 ring-offset-background file:border-0 file:bg-[#27272a] file:text-sm file:font-medium file:text-gray-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(147,51,234,0.4)] focus-visible:border-[#9333ea] focus-visible:bg-[#27272a] disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-300 shadow-[0_2px_8px_rgba(0,0,0,0.3)] focus-visible:shadow-[0_4px_16px_rgba(147,51,234,0.3),0_0_20px_rgba(147,51,234,0.15)]",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
