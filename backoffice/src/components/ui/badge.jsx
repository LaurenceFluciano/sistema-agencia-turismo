import * as React from "react";
import { cn } from "../../lib/utils";

function Badge({ className, variant = "default", ...props }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium",
        variant === "default" && "bg-muted text-muted-foreground",
        variant === "outline" && "border border-border bg-transparent text-foreground",
        className,
      )}
      {...props}
    />
  );
}

export { Badge };
