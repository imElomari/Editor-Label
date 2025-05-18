"use client"

interface ShapeLayerProps {
  layer: any
}

export function ShapeLayer({ layer }: ShapeLayerProps) {
  const renderShape = () => {
    const color = layer.color || "#4f46e5"

    switch (layer.shape) {
      case "rectangle":
        return (
          <div
            className="w-full h-full rounded-md"
            style={{
              backgroundColor: color,
            }}
          />
        )
      case "circle":
        return (
          <div
            className="w-full h-full rounded-full"
            style={{
              backgroundColor: color,
            }}
          />
        )
      case "triangle":
        return (
          <div className="w-full h-full flex items-center justify-center">
            <div
              style={{
                width: 0,
                height: 0,
                borderLeft: `${layer.boxSize.width / 2}px solid transparent`,
                borderRight: `${layer.boxSize.width / 2}px solid transparent`,
                borderBottom: `${layer.boxSize.height}px solid ${color}`,
              }}
            />
          </div>
        )
      case "star":
        return (
          <div className="w-full h-full flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill={color} className="w-full h-full">
              <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
            </svg>
          </div>
        )
      default:
        return (
          <div
            className="w-full h-full rounded-md"
            style={{
              backgroundColor: color,
            }}
          />
        )
    }
  }

  return (
    <div
      className="w-full h-full"
    >
      {renderShape()}
    </div>
  )
}
