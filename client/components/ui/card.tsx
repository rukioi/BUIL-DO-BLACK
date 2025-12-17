import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * === Card Component ===
 * Estilo Dark Elegant com fundo sólido opaco
 */

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      // Fundo sólido opaco premium - estilo mais agressivo
      "relative rounded-2xl border-2 border-[#27272a] bg-[#1a1a1d] text-[var(--foreground)]",
      "shadow-[0_8px_32px_rgba(0,0,0,0.8)] shadow-[0_0_30px_rgba(147,51,234,0.15)]",
      "transition-all duration-300 ease-out",
      "hover:shadow-[0_12px_48px_rgba(0,0,0,0.9)] hover:shadow-[0_0_40px_rgba(147,51,234,0.25)]",
      "hover:translate-y-[-3px] hover:border-[#3f3f46]",
      className
    )}
    {...props}
  />
));
Card.displayName = "Card";

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex flex-col space-y-2 p-6 border-b-2 border-[#27272a] bg-[#1f1f22] rounded-t-2xl",
      className
    )}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      // Roxo premium com brilho
      "text-lg font-bold tracking-wide text-[var(--accent)]",
      "drop-shadow-[0_0_10px_rgba(147,51,234,0.3)]",
      className
    )}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn(
      "text-sm text-[var(--muted-foreground)] leading-relaxed",
      className
    )}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "p-6 pt-4 text-gray-200 animate-[smoothFadeIn_0.5s_ease]",
      className
    )}
    {...props}
  />
));
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex items-center justify-between p-6 pt-0 border-t-2 border-[#27272a] bg-[#1a1a1d] rounded-b-2xl",
      className
    )}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
};
