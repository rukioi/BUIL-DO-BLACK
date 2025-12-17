import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border-0 px-3 py-1.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-[rgba(147,51,234,0.4)] focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-[#9333ea] to-[#a855f7] text-white shadow-[0_2px_10px_rgba(147,51,234,0.4)] hover:from-[#a855f7] hover:to-[#c084fc]",
        secondary:
          "bg-[#27272a] text-gray-200 border border-[#3f3f46] hover:bg-[#3f3f46]",
        destructive:
          "bg-gradient-to-r from-[#ef4444] to-[#dc2626] text-white shadow-[0_2px_10px_rgba(239,68,68,0.4)] hover:from-[#dc2626] hover:to-[#b91c1c]",
        outline: "text-gray-200 border-2 border-[#3f3f46] bg-[#1a1a1d] hover:bg-[#27272a] hover:border-[#9333ea]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
