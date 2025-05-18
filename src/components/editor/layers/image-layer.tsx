"use client"

interface ImageLayerProps {
  layer: any
}

export function ImageLayer({ layer }: ImageLayerProps) {
  return (
    <div
      className="w-full h-full overflow-hidden rounded-sm"
    >
      <img
        src={layer.url || "/placeholder.svg?height=300&width=300"}
        alt="Layer"
        className="w-full h-full object-cover"
        draggable={false}
      />
    </div>
  )
}
