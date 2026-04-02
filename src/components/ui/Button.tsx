import * as React from "react"
import { cn } from "../../utils/cn"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-2xl text-sm font-semibold ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0071e3]/20 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
          {
            "bg-[#0071e3] text-white hover:bg-[#0077ed] shadow-lg shadow-blue-500/10": variant === "default",
            "bg-[#ff3b30] text-white hover:bg-[#ff453a] shadow-lg shadow-red-500/10": variant === "destructive",
            "border border-[#d2d2d7] bg-white hover:bg-[#f5f5f7] text-[#1d1d1f]": variant === "outline",
            "bg-[#f5f5f7] text-[#1d1d1f] hover:bg-[#e8e8ed]": variant === "secondary",
            "hover:bg-[#f5f5f7] text-[#1d1d1f]": variant === "ghost",
            "text-[#0071e3] underline-offset-4 hover:underline": variant === "link",
            "h-12 px-6 py-3": size === "default",
            "h-9 rounded-xl px-3": size === "sm",
            "h-14 rounded-2xl px-10": size === "lg",
            "h-10 w-10 rounded-xl": size === "icon",
          },
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
