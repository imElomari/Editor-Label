"use client"

import type React from "react"

import { cn } from "@/lib/utils"
import type { Direction } from "@/types/resize"

interface ResizeHandlesProps {
  onResizeStart: (direction: Direction) => (e: React.MouseEvent) => void
  color?: string
}

export function ResizeHandles({ onResizeStart}: ResizeHandlesProps) {
  const handles: Direction[] = ["top", "bottom", "left", "right", "topLeft", "bottomLeft", "bottomRight", "topRight"]
  const isCorner = (direction: Direction) => ["topLeft", "topRight", "bottomLeft", "bottomRight"].includes(direction)

  return (
    <>
      {handles.map((direction) => (
        <div
          key={direction}
          className={cn(
            "absolute z-10",
            isCorner(direction) ? "w-2.5 h-2.5" : "w-2 h-2",
            "bg-white border border-gray-400",
            isCorner(direction) ? "rounded-sm" : "rounded-full",
            "hover:border-primary hover:bg-primary/10",
            "active:bg-primary/20",
            "transition-all duration-150 ease-out",
            {
              "top-0 left-0 -translate-x-1/2 -translate-y-1/2 cursor-nw-resize": direction === "topLeft",
              "top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 cursor-n-resize": direction === "top",
              "top-0 right-0 translate-x-1/2 -translate-y-1/2 cursor-ne-resize": direction === "topRight",
              "top-1/2 right-0 translate-x-1/2 -translate-y-1/2 cursor-e-resize": direction === "right",
              "bottom-0 right-0 translate-x-1/2 translate-y-1/2 cursor-se-resize": direction === "bottomRight",
              "bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 cursor-s-resize": direction === "bottom",
              "bottom-0 left-0 -translate-x-1/2 translate-y-1/2 cursor-sw-resize": direction === "bottomLeft",
              "top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 cursor-w-resize": direction === "left",
            },
          )}
          onMouseDown={(e) => {
            e.stopPropagation()
            onResizeStart(direction)(e)
          }}
          style={{
            boxShadow: "0 0 0 1px rgba(255, 255, 255, 0.5)",
          }}
        />
      ))}
      <div
        className="absolute top-0 left-0 w-full h-full pointer-events-none"
        style={{
          border: "1px solid var(--primary)",
          borderRadius: "2px",
        }}
      />
    </>
  )
}
