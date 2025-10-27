"use client";

import * as React from "react";
import * as TogglePrimitive from "@radix-ui/react-toggle";
import { cn } from "@/lib/utils";

const Toggle = React.forwardRef<
  React.ElementRef<typeof TogglePrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof TogglePrimitive.Root>
>(({ className, ...props }, ref) => (
  <TogglePrimitive.Root
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center rounded-md border border-transparent bg-muted px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted/80 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground",
      className
    )}
    {...props}
  />
));
Toggle.displayName = TogglePrimitive.Root.displayName;

export { Toggle };
