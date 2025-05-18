"use client"

interface FrameLayerProps {
  layer: any
}

export function FrameLayer({ layer }: FrameLayerProps) {
  return (
    <div
      className="w-full h-full border-2 border-dashed border-muted-foreground/30 rounded-md flex items-center justify-center"
      style={{
        backgroundColor: layer.background || "transparent",
      }}
    >
      <div className="text-muted-foreground text-sm">Frame</div>
    </div>
  )
}
