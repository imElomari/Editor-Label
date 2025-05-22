"use client"

import { cn } from "@/lib/utils"
import type { ShapeLayer } from "@/types/layer"

interface ShapeLayerProps {
  layer: ShapeLayer;
}

export function ShapeLayer({ layer }: ShapeLayerProps) {
  return (
    <div
      className={cn("w-full h-full")}
      style={{
        clipPath: layer.clipPath ? `path('${layer.clipPath}')` : undefined,
        backgroundColor: layer.color,
        width: "100%",
        height: "100%",
      }}
    />
  );
}
