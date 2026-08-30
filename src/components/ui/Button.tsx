import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "navy";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-brand-orange text-white hover:bg-brand-orange-dark focus-visible:outline-brand-orange",
  navy: "bg-brand-navy text-white hover:bg-brand-navy-light focus-visible:outline-brand-navy",
  secondary:
    "bg-white text-brand-navy border border-surface-border hover:bg-surface-muted focus-visible:outline-brand-navy",
  outline:
    "bg-transparent text-brand-navy border border-brand-navy/20 hover:bg-brand-navy/5 focus-visible:outline-brand-navy",
  ghost: "bg-transparent text-brand-navy hover:bg-surface-muted focus-visible:outline-brand-navy",
};

const sizeClasses: Record<Size, string> = {
  sm: "text-sm px-3 py-1.5 rounded-lg gap-1.5",
  md: "text-sm px-4 py-2.5 rounded-xl gap-2",
  lg: "text-base px-6 py-3.5 rounded-xl gap-2",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center font-medium transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 cursor-pointer",
          variantClasses[variant],
          sizeClasses[size],
          className,
        )}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";
