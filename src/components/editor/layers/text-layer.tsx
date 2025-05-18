"use client"

import type React from "react"
import { useEditor } from "../editor-context"

interface TextLayerProps {
  layer: any
}

export function TextLayer({ layer }: TextLayerProps) {
  const { actions } = useEditor()

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    // Enable contentEditable on double click
    const target = e.currentTarget as HTMLDivElement
    target.contentEditable = "true"
    target.focus()

    // Select all text
    const selection = window.getSelection()
    const range = document.createRange()
    range.selectNodeContents(target)
    selection?.removeAllRanges()
    selection?.addRange(range)
  }

  const handleBlur = (e: React.FocusEvent<HTMLDivElement>) => {
    e.currentTarget.contentEditable = "false"
    const newText = e.currentTarget.textContent || layer.props.text

    if (newText !== layer.props.text) {
      actions.updateLayer(layer.id, {

          ...layer.props,
          text: newText,

      })
      actions.saveToHistory()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Allow Enter key for new lines
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      document.execCommand("insertLineBreak")
    }

    // Prevent propagation of keyboard events to avoid triggering global shortcuts
    e.stopPropagation()
  }

  return (
    <div
      className="w-full h-full overflow-hidden outline-none"
      style={{
        color: layer.color || "#000000",
        fontFamily: layer.fontFamily || "Inter, sans-serif",
        fontSize: `${layer.fontSize || 16}px`,
        textAlign: layer.textAlign || "left",
        lineHeight: "1.2",
        padding: "4px",
        userSelect: "none",
      }}
      onDoubleClick={handleDoubleClick}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      spellCheck={false}
    >
      {layer.text}
    </div>
  )
}
