import * as React from "react"
import { cn } from "../../utils/cn"

export interface CheckboxProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, ...props }, ref) => {
    return (
      <input
        type="checkbox"
        className={cn(
          "h-5 w-5 rounded-lg border-2 border-[#d2d2d7] text-[#0071e3] transition-all focus:ring-2 focus:ring-[#0071e3]/20 checked:bg-[#0071e3] checked:border-[#0071e3] cursor-pointer appearance-none relative checked:after:content-[''] checked:after:absolute checked:after:left-[6px] checked:after:top-[2px] checked:after:w-[5px] checked:after:h-[10px] checked:after:border-white checked:after:border-r-2 checked:after:border-b-2 checked:after:rotate-45",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Checkbox.displayName = "Checkbox"

export { Checkbox }
