"use client"

import { useMemo } from "react"
import { cloneDeep } from "lodash"
import { useEditor } from "."
import { getTransformStyle } from "@/utils/getTransformStyle"
import type { BoxData, BoxSize, Delta } from "@/types"
import { angleBetweenPoints } from "@/utils/2d/angleBetwwenPoints"
import { distanceBetweenPoints } from "@/utils/2d/distanceBetweenPoints"
import { getPositionChangesBetweenTwoCorners } from "@/utils/2d/getPositionChangesBetweenTwoCorners"
import { getSizeWithRatio } from "@/utils/2d/getSizeWithRatio"
import { horizontalAndVerticalChange } from "@/utils/2d/horizontalAndVerticalChange"
import { visualCorners } from "@/utils/2d/visualCorners"
import type { Direction } from "@/types/resize"

export const useResize = (getData: () => BoxData) => {
  const frameScale = useEditor().state.scale
  const MIN_WIDTH = 20
  const MIN_HEIGHT = 20
  return useMemo(
    () => ({
      getResized: (
        direction: Direction,
        original: { clientX: number; clientY: number },
        newPosition: { clientX: number; clientY: number },
        lockAspect: boolean,
      ): BoxData => {
        const { boxSize, position, rotate, scale } = getData()
        const ratio = boxSize.width / boxSize.height
        const matrix = new WebKitCSSMatrix(getTransformStyle({ position, rotate }))
        const distance = distanceBetweenPoints(original, newPosition, frameScale)
        const change = horizontalAndVerticalChange(rotate, angleBetweenPoints(original, newPosition), distance)

        // Calculate new size based on direction and change
        const newSize = getNewSize(boxSize, change, position, direction)

        // Apply minimum size constraints
        const sizeWithLimit = {
          ...newSize,
          width: Math.max(MIN_WIDTH, newSize.width),
          height: Math.max(MIN_HEIGHT, newSize.height),
        }

        // Apply aspect ratio lock if needed
        const newSizeWithLockAspect = getSizeWithRatio(sizeWithLimit, ratio, lockAspect)

        // Calculate position changes based on corners
        const oldCorners = visualCorners(boxSize, matrix, position)
        const newCorners = visualCorners(newSizeWithLockAspect, matrix, position)
        const { changeX, changeY } = getPositionChangesBetweenTwoCorners(oldCorners, newCorners, direction)

        return {
          boxSize: {
            ...newSizeWithLockAspect,
            width: newSizeWithLockAspect.x,
            height: newSizeWithLockAspect.y,
          },
          position: {
            x: position.x - changeX,
            y: position.y - changeY,
          },
          rotate,
          scale,
        }
      },
    }),
    [getData, frameScale],
  )
}

const getNewSize = (oldSize: BoxSize, change: BoxSize, position: Delta, direction: Direction) => {
  // Create a copy to avoid mutation
  const result = { ...oldSize, x: position.x, y: position.y }

  switch (direction) {
    case "top":
      result.y = position.y + change.height
      result.height = Math.max(1, oldSize.height - change.height)
      break
    case "bottom":
      result.height = Math.max(1, oldSize.height + change.height)
      break
    case "left":
      result.x = position.x + change.width
      result.width = Math.max(1, oldSize.width - change.width)
      break
    case "right":
      result.width = Math.max(1, oldSize.width + change.width)
      break
    case "topLeft":
      result.x = position.x + change.width
      result.y = position.y + change.height
      result.width = Math.max(1, oldSize.width - change.width)
      result.height = Math.max(1, oldSize.height - change.height)
      break
    case "bottomLeft":
      result.x = position.x + change.width
      result.width = Math.max(1, oldSize.width - change.width)
      result.height = Math.max(1, oldSize.height + change.height)
      break
    case "bottomRight":
      result.width = Math.max(1, oldSize.width + change.width)
      result.height = Math.max(1, oldSize.height + change.height)
      break
    case "topRight":
      result.y = position.y + change.height
      result.width = Math.max(1, oldSize.width + change.width)
      result.height = Math.max(1, oldSize.height - change.height)
      break
  }

  return result
}

export const getImageSize = (
  box: BoxData,
  image: BoxData,
  direction: Direction,
  change: { width: number; height: number },
) => {
  const res = cloneDeep({
    boxSize: box.boxSize,
    position: box.position,
    rotate: box.rotate,
    scale: box.scale,
    image: {
      boxSize: image.boxSize,
      position: image.position,
      rotate: image.rotate,
    },
  })
  const imageRatio = image.boxSize.width / image.boxSize.height
  if (change.width !== 0) {
    res.boxSize.width += change.width
    if (direction.toLowerCase().includes("left")) {
      if (change.width > Math.abs(res.image.position.x)) {
        //resize image
        res.image.position.x = 0
        const changeImageSize = change.width - Math.abs(image.position.x)
        res.image.boxSize.width += changeImageSize
        res.image.boxSize.height += changeImageSize / imageRatio
      } else {
        res.image.position.x += change.width
      }
    }
    if (direction.toLowerCase().includes("right")) {
      if (change.width + box.boxSize.width - image.position.x > image.boxSize.width) {
        //resize image
        const changeImageSize = change.width + box.boxSize.width - image.position.x - image.boxSize.width
        res.image.boxSize.width += changeImageSize
        res.image.boxSize.height += changeImageSize / imageRatio
      }
    }
  }
  if (change.height !== 0) {
    res.boxSize.height += change.height
    if (direction.toLowerCase().includes("top")) {
      if (change.height > Math.abs(res.image.position.y)) {
        //resize image
        res.image.position.y = 0
        const changeImageSize = change.height - Math.abs(image.position.y)
        res.image.boxSize.height += changeImageSize
        res.image.boxSize.width += changeImageSize * imageRatio
      } else {
        res.image.position.y += change.height
      }
    }
    if (direction.toLowerCase().includes("bottom")) {
      if (change.height + box.boxSize.height - image.position.y > image.boxSize.height) {
        //resize image
        const changeImageSize = change.height + box.boxSize.height - image.position.y - image.boxSize.height
        res.image.boxSize.height += changeImageSize
        res.image.boxSize.width += changeImageSize * imageRatio
      }
    }
  }
  return res
}