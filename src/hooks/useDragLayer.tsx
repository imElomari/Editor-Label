"use client"

import type React from "react"
import { useState, useCallback, useEffect } from "react"
import type { Delta } from "@/types/common"

export const useDragLayer = (initialPosition: Delta, onDragEnd: (position: Delta) => void) => {
  const [isDragging, setIsDragging] = useState(false)
  const [position, setPosition] = useState(initialPosition)
  const [startPosition, setStartPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 })
  const [startOffset, setStartOffset] = useState<Delta>({ x: 0, y: 0 })

  const handleDragStart = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      setIsDragging(true)
      setStartPosition({ x: e.clientX, y: e.clientY })
      setStartOffset({ x: position.x, y: position.y })

      // Add event listeners for drag and drop
      document.addEventListener("mousemove", handleDragMove)
      document.addEventListener("mouseup", handleDragEnd)
    },
    [position],
  )

  const handleDragMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return

      const dx = e.clientX - startPosition.x
      const dy = e.clientY - startPosition.y

      const newPosition = {
        x: startOffset.x + dx,
        y: startOffset.y + dy,
      }

      setPosition(newPosition)
    },
    [isDragging, startPosition, startOffset],
  )

  const handleDragEnd = useCallback(() => {
    setIsDragging(false)
    onDragEnd(position)

    // Remove event listeners
    document.removeEventListener("mousemove", handleDragMove)
    document.removeEventListener("mouseup", handleDragEnd)
  }, [position, onDragEnd])

  // Clean up event listeners on unmount
  useEffect(() => {
    return () => {
      document.removeEventListener("mousemove", handleDragMove)
      document.removeEventListener("mouseup", handleDragEnd)
    }
  }, [handleDragMove, handleDragEnd])

  return {
    position,
    isDragging,
    handleDragStart,
    handleDrag: handleDragMove,
    handleDragEnd,
  }
}
