"use client"

import type React from "react"

import { cn } from "@/lib/utils"
import { Direction } from "@/types/resize"

interface ResizeHandlesProps {
  onResizeStart: (direction: Direction) => (e: React.MouseEvent) => void
}

export function ResizeHandles({ onResizeStart }: ResizeHandlesProps) {
  const handles: Direction[] = [  "top" , "bottom" , "left" , "right" , "topLeft" , "bottomLeft" , "bottomRight" , "topRight"]
  
  return (
    <>
      {handles.map((direction) => (
        <div
          key={direction}
          className={cn(
            "absolute w-3 h-3 bg-white dark:bg-gray-800 border-2 border-primary rounded-full z-10",
            "hover:bg-primary hover:border-primary-foreground transition-colors",
            {
              "top-0 left-0 -translate-x-1/2 -translate-y-1/2 cursor-nw-resize": direction === "top",
              "top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 cursor-n-resize": direction === "bottom",
              "top-0 right-0 translate-x-1/2 -translate-y-1/2 cursor-ne-resize": direction === "left",
              "top-1/2 right-0 translate-x-1/2 -translate-y-1/2 cursor-e-resize": direction === "right",
              "bottom-0 right-0 translate-x-1/2 translate-y-1/2 cursor-se-resize": direction === "topLeft",
              "bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 cursor-s-resize": direction === "bottomLeft",
              "bottom-0 left-0 -translate-x-1/2 translate-y-1/2 cursor-sw-resize": direction === "bottomRight",
              "top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 cursor-w-resize": direction === "topRight",
            },
          )}
          onMouseDown={(e) => {
            e.stopPropagation()
            onResizeStart(direction)(e)
          }}
          style={{
            boxShadow: "0 0 0 1px rgba(0,0,0,0.1)",
          }}
        />
      ))}
      <div className="absolute top-0 left-0 w-full h-full border-2 border-primary rounded-sm pointer-events-none" />
    </>
  )
}
