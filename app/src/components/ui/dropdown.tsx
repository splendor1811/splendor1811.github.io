import * as React from "react";
import * as DropdownPrimitive from "@radix-ui/react-dropdown-menu";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export const DropdownMenu = DropdownPrimitive.Root;
export const DropdownTrigger = DropdownPrimitive.Trigger;

export function DropdownContent({
  children,
  align = "end",
  className,
}: {
  children: React.ReactNode;
  align?: "start" | "center" | "end";
  className?: string;
}) {
  return (
    <DropdownPrimitive.Portal>
      <DropdownPrimitive.Content
        align={align}
        sideOffset={6}
        className={cn(
          "z-50 min-w-[180px] overflow-hidden rounded-lg border border-border bg-popover p-1 shadow-raised",
          "animate-scale-in origin-[--radix-dropdown-menu-content-transform-origin]",
          className,
        )}
      >
        {children}
      </DropdownPrimitive.Content>
    </DropdownPrimitive.Portal>
  );
}

export function DropdownItem({
  children,
  onSelect,
  active,
  className,
}: {
  children: React.ReactNode;
  onSelect?: () => void;
  active?: boolean;
  className?: string;
}) {
  return (
    <DropdownPrimitive.Item
      onSelect={onSelect}
      className={cn(
        "flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm text-muted-foreground outline-none transition-colors focus:bg-surface-raised focus:text-foreground data-[disabled]:opacity-50",
        active && "text-foreground",
        className,
      )}
    >
      <span className="flex-1">{children}</span>
      {active && <Check size={14} className="text-primary" />}
    </DropdownPrimitive.Item>
  );
}

export const DropdownSeparator = () => (
  <DropdownPrimitive.Separator className="my-1 h-px bg-border" />
);
