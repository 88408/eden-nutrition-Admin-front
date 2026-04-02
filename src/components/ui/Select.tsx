import * as React from "react"
import * as SelectPrimitive from "@radix-ui/react-select"
import { Check, ChevronDown, ChevronUp } from "lucide-react"
import { cn } from "../../utils/cn"
import { motion, AnimatePresence } from "motion/react"

const SelectRoot = SelectPrimitive.Root

const SelectGroup = SelectPrimitive.Group

const SelectValue = SelectPrimitive.Value

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(
      "flex h-12 w-full items-center justify-between rounded-2xl bg-[#f5f5f7] px-4 py-2 text-sm font-medium text-[#1d1d1f] transition-all hover:bg-[#ebebe7] focus:outline-none focus:ring-2 focus:ring-[#0071e3]/20 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
      className
    )}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <ChevronDown className="h-4 w-4 text-[#86868b] opacity-50" />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
))
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName

const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = "popper", ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      className={cn(
        "relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-2xl border border-black/[0.05] bg-white text-[#1d1d1f] shadow-2xl data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        position === "popper" &&
          "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
        className
      )}
      position={position}
      {...props}
    >
      <SelectPrimitive.Viewport
        className={cn(
          "p-1.5",
          position === "popper" &&
            "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"
        )}
      >
        {children}
      </SelectPrimitive.Viewport>
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
))
SelectContent.displayName = SelectPrimitive.Content.displayName

const SelectLabel = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    className={cn("py-1.5 pl-8 pr-2 text-xs font-semibold text-[#86868b] uppercase tracking-wider", className)}
    {...props}
  />
))
SelectLabel.displayName = SelectPrimitive.Label.displayName

const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex w-full cursor-default select-none items-center rounded-xl py-2.5 pl-8 pr-2 text-sm font-medium outline-none transition-colors focus:bg-[#0071e3] focus:text-white data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <SelectPrimitive.ItemIndicator>
        <Check className="h-4 w-4" />
      </SelectPrimitive.ItemIndicator>
    </span>

    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
))
SelectItem.displayName = SelectPrimitive.Item.displayName

const SelectSeparator = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-black/[0.05]", className)}
    {...props}
  />
))
SelectSeparator.displayName = SelectPrimitive.Separator.displayName

/**
 * A simplified Select component that wraps Radix UI Select for easier usage.
 * It maps native-like props to Radix UI components.
 */
interface SimpleSelectProps {
  value?: any;
  defaultValue?: any;
  onChange?: (e: { target: { value: string } }) => void;
  placeholder?: string;
  className?: string;
  children?: React.ReactNode;
  required?: boolean;
}

const SimpleSelect = React.forwardRef<HTMLButtonElement, SimpleSelectProps>(
  ({ value, defaultValue, onChange, placeholder, className, children, required }, ref) => {
    // Handle the onChange to match native select behavior
    const handleValueChange = (val: string) => {
      if (onChange) {
        onChange({ target: { value: val } });
      }
    };

    // Extract options from children
    const options = React.Children.toArray(children).map((child, index) => {
      if (React.isValidElement(child) && child.type === "option") {
        const val = child.props.value?.toString();
        // Radix UI SelectItem does not allow empty string values.
        // We filter them out as they are usually placeholders.
        if (val === "" || val === undefined) return null;

        return {
          id: `opt-${index}-${val}`,
          value: val,
          label: child.props.children,
          disabled: child.props.disabled,
        };
      }
      return null;
    }).filter((opt): opt is { id: string; value: string; label: any; disabled?: boolean } => opt !== null);

    // Try to find a placeholder from the children if not provided
    const derivedPlaceholder = placeholder || React.Children.toArray(children).find(
      (child) => React.isValidElement(child) && child.type === "option" && (child.props.value === "" || child.props.value === undefined)
    )?.props?.children;

    return (
      <SelectRoot 
        value={value?.toString()} 
        defaultValue={defaultValue?.toString()} 
        onValueChange={handleValueChange}
        required={required}
      >
        <SelectTrigger ref={ref} className={className}>
          <SelectValue placeholder={derivedPlaceholder || "请选择..."} />
        </SelectTrigger>
        <SelectContent>
          {options.map((opt) => (
            <SelectItem key={opt.id} value={opt.value} disabled={opt.disabled}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </SelectRoot>
    );
  }
);
SimpleSelect.displayName = "SimpleSelect";

export {
  SelectRoot,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SimpleSelect as Select,
}
