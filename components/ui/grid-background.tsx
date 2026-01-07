import React from "react";
import { cn } from "@/lib/utils";

interface GridBackgroundProps {
  children?: React.ReactNode;
  className?: string;
}

export function GridBackground({ children, className }: GridBackgroundProps) {
  return (
    <div
      className={cn(
        "relative flex w-full min-h-screen items-center justify-center",
        "bg-background text-foreground",
        className
      )}
    >
      {/* GRID: pakai warna --grid dengan alpha */}
      <div
        className={cn(
          "absolute inset-0",
          "[background-size:24px_24px]",
          "[background-image:linear-gradient(to_right,hsl(var(--grid)_/_0.7)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--grid)_/_0.7)_1px,transparent_1px)]"
        )}
      />

      {/* Radial fade di tengah – kalau dirasa terlalu menutupi grid bisa nanti dihapus */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-background [mask-image:radial-gradient(ellipse_at_center,transparent_15%,black)]" />

      <div className="relative z-10 w-full">{children}</div>
    </div>
  );
}
