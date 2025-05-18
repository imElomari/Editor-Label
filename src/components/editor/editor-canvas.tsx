"use client"

import type React from "react"
import { useRef, useState, useEffect } from "react"
import { useEditor } from "./editor-context"
import { TextLayer } from "./layers/text-layer"
import { ShapeLayer } from "./layers/shape-layer"
import { ImageLayer } from "./layers/image-layer"
import { FrameLayer } from "./layers/frame-layer"
import { cn } from "@/lib/utils"
import { ResizeHandles } from "../../utils/ResizeHandles"
import { Direction } from "@/types/resize"
import { Layer } from "@/types/layer"

export function EditorCanvas() {
  const { state, actions } = useEditor()
  const canvasRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [resizing, setResizing] = useState<{ layerId: string; direction: Direction } | null>(null)
  const [resizeStart, setResizeStart] = useState({ width: 0, height: 0, x: 0, y: 0 })

  const currentPage = state.page

  // Handle keyboard shortcuts for moving selected layers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (state.selectedLayerIds.length > 0) {
        const moveAmount = e.shiftKey ? 10 : 1
        let deltaX = 0
        let deltaY = 0

        switch (e.key) {
          case "ArrowUp":
            deltaY = -moveAmount
            break
          case "ArrowDown":
            deltaY = moveAmount
            break
          case "ArrowLeft":
            deltaX = -moveAmount
            break
          case "ArrowRight":
            deltaX = moveAmount
            break
          default:
            return 
        }

        if (deltaX !== 0 || deltaY !== 0) {
          e.preventDefault()

          // Save state to history before moving
          if (!isDragging) {
            actions.saveToHistory()
          }

          // Update all selected layers
          state.selectedLayerIds.forEach((layerId) => {
            const layer = currentPage.layers[layerId]
            if (layer) {
              const newPosition = {
                x: layer.boxData.position.x + deltaX,
                y: layer.boxData.position.y + deltaY,
              }
              actions.updateLayer(layerId, { boxData: { ...layer.boxData, position: newPosition } })
            }
          })
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [state.selectedLayerIds, isDragging, actions, currentPage.layers])

  // Handle canvas click to deselect all layers
  const handleCanvasClick = (e: React.MouseEvent) => {
    if (e.target === canvasRef.current) {
      actions.deselectAllLayers()
    }
  }

  // Handle zoom with mouse wheel
  const handleWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey) {
      e.preventDefault()
      const delta = e.deltaY > 0 ? -0.1 : 0.1
      const newScale = Math.max(0.1, Math.min(5, state.scale + delta))
      actions.setScale(newScale)
    }
  }

  // Handle layer drag start
  const handleLayerDragStart = (e: React.MouseEvent, layerId: string) => {
    if (!state.selectedLayerIds.includes(layerId)) {
      if (!e.shiftKey) {
        actions.deselectAllLayers()
      }
      actions.selectLayer(layerId)
    }

    const layer = currentPage.layers[layerId]
    if (layer ) {
      setIsDragging(true)
      setDragStart({ x: e.clientX, y: e.clientY })

      // Save state to history before dragging
      actions.saveToHistory()

      // Add event listeners for drag and drop
      document.addEventListener("mousemove", handleLayerDrag)
      document.addEventListener("mouseup", handleLayerDragEnd)
    }
  }

  // Handle layer drag
  const handleLayerDrag = (e: MouseEvent) => {
    if (isDragging) {
      const dx = (e.clientX - dragStart.x) / state.scale
      const dy = (e.clientY - dragStart.y) / state.scale

      // Update all selected layers
      state.selectedLayerIds.forEach((layerId) => {
        const layer = currentPage.layers[layerId]
        if (layer) {
          const newPosition = {
            x: layer.boxData.position.x + dx,
            y: layer.boxData.position.y + dy,
          }
          actions.updateLayer(layerId, { boxData: { ...layer.boxData, position: newPosition } })
        }
      })

      // Update drag start for next move
      setDragStart({ x: e.clientX, y: e.clientY })
    }
  }

  // Handle layer drag end
  const handleLayerDragEnd = () => {
    setIsDragging(false)
    document.removeEventListener("mousemove", handleLayerDrag)
    document.removeEventListener("mouseup", handleLayerDragEnd)
  }

  // Handle resize start
  const handleResizeStart = (e: React.MouseEvent, layerId: string, direction: Direction) => {
    e.stopPropagation()

    const layer = currentPage.layers[layerId]
    if (layer) {
      setResizing({ layerId, direction })
      setResizeStart({
        width: layer.boxData.boxSize.width,
        height: layer.boxData.boxSize.height,
        x: e.clientX,
        y: e.clientY,
      })

      // Save state to history before resizing
      actions.saveToHistory()

      // Add event listeners for resize
      document.addEventListener("mousemove", handleResize)
      document.addEventListener("mouseup", handleResizeEnd)
    }
  }

  // Handle resize
  const handleResize = (e: MouseEvent) => {
    if (resizing) {
      const { layerId, direction } = resizing
      const layer = currentPage.layers[layerId]

      if (layer) {
        const dx = (e.clientX - resizeStart.x) / state.scale
        const dy = (e.clientY - resizeStart.y) / state.scale

        let newWidth = resizeStart.width
        let newHeight = resizeStart.height
        let newX = layer.boxData.position.x
        let newY = layer.boxData.position.y

        // Handle different resize directions
        if (direction.includes("e")) {
          newWidth = Math.max(20, resizeStart.width + dx)
        }
        if (direction.includes("w")) {
          const widthChange = Math.min(resizeStart.width - 20, dx)
          newWidth = resizeStart.width - widthChange
          newX = layer.boxData.position.x + widthChange
        }
        if (direction.includes("s")) {
          newHeight = Math.max(20, resizeStart.height + dy)
        }
        if (direction.includes("n")) {
          const heightChange = Math.min(resizeStart.height - 20, dy)
          newHeight = resizeStart.height - heightChange
          newY = layer.boxData.position.y + heightChange
        }

        // Maintain aspect ratio for images if shift key is pressed
        if (e.shiftKey && layer.type === "image") {
          const aspectRatio = resizeStart.width / resizeStart.height
          if (direction.includes("n") || direction.includes("s")) {
            newWidth = newHeight * aspectRatio
          } else {
            newHeight = newWidth / aspectRatio
          }
        }

        actions.updateLayer(layerId, {
          boxData: { 
            ...layer.boxData, 
            boxSize: { width: newWidth, height: newHeight },
            position: { x: newX, y: newY }
          }
        })
      }
    }
  }

  // Handle resize end
  const handleResizeEnd = () => {
    setResizing(null)
    document.removeEventListener("mousemove", handleResize)
    document.removeEventListener("mouseup", handleResizeEnd)
  }

  // Set up wheel event listener
  useEffect(() => {
    const canvas = canvasRef.current
    if (canvas) {
      canvas.addEventListener("wheel", handleWheel as any, { passive: false })
      return () => {
        canvas.removeEventListener("wheel", handleWheel as any)
      }
    }
  }, [state.scale])

  return (
    <div
      className="flex-1 overflow-auto bg-gray-100 dark:bg-gray-800 flex items-center justify-center"
      ref={canvasRef}
      onClick={handleCanvasClick}
      id="editor-canvas"
    >
      <div
        className="relative bg-white dark:bg-gray-900 shadow-lg transition-transform rounded-sm"
        style={{
          width: currentPage.size.width * state.scale,
          height: currentPage.size.height * state.scale,
          transform: `scale(${state.scale})`,
          transformOrigin: "center",
        }}
      >
        {/* Render all layers */}
        {Object.entries(currentPage.layers as Record<string, Layer>)
          .sort((a, b) => ((a[1] as any).zIndex || 0) - ((b[1] as any).zIndex || 0))
          .map(([id, layer]) => {
            const isSelected = state.selectedLayerIds.includes(id)
            const isHovered = state.hoveredLayer === id

            return (
              <div
                key={id}
                className={cn(
                  "absolute transition-shadow",
                  isSelected && "ring-2 ring-primary",
                  isHovered && !isSelected && "ring-1 ring-primary/50",
                )}
                style={{
                  left: layer.boxData.position.x,
                  top: layer.boxData.position.y,
                  width: layer.boxData.boxSize.width,
                  height: layer.boxData.boxSize.height,
                  transform: `rotate(${layer.boxData.rotate}deg)`,
                  opacity: layer.opacity,
                  zIndex: isSelected ? 10 : 1,
                  cursor: isDragging ? "grabbing" : "grab",
                }}
                onClick={(e) => {
                  e.stopPropagation()
                  if (!e.shiftKey) {
                    actions.deselectAllLayers()
                  }
                  actions.selectLayer(id)
                }}
                onMouseDown={(e) => handleLayerDragStart(e, id)}
                onMouseEnter={() => actions.hoverLayer(id)}
                onMouseLeave={() => actions.hoverLayer(null)}
              >
                {renderLayer(layer)}

                {isSelected && (
                  <ResizeHandles
                    onResizeStart={(direction) => (e: React.MouseEvent) => handleResizeStart(e, id, direction)}
                  />
                )}
              </div>
            )
          })}
      </div>
    </div>
  )
}

function renderLayer(layer: Layer) {
  switch (layer.type) {
    case "text":
      return <TextLayer layer={layer} />
    case "shape":
      return <ShapeLayer layer={layer} />
    case "image":
      return <ImageLayer layer={layer} />
    case "frame":
      return <FrameLayer layer={layer} />
    default:
      return null
  }
}
