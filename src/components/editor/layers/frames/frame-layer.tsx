"use client"

interface FrameLayerProps {
  layer: any
}

export function FrameLayer({ layer }: FrameLayerProps) {
  return (
    <div
    >
      {layer.image ? (
        <img
          src={layer.image.replace("http://localhost:4000", "/api")}
          alt={layer.desc || "Frame"}
          draggable={false}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
          No Frame Image
        </div>
      )}
    </div>
  )
}
