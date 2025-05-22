"use client";

import type React from "react";
import { useEffect, useRef } from "react";
import { useEditor } from "../../editor-context";

interface TextLayerProps extends React.HTMLAttributes<HTMLDivElement> {
  layer: any;
  style?: React.CSSProperties;
}

export function TextLayer({ layer, ...props }: TextLayerProps) {
  const { actions } = useEditor();
  const resizeObserverRef = useRef<ResizeObserver | null>(null);
  const layerRef = useRef<HTMLDivElement>(null);

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Enable contentEditable on double click
    const target = e.currentTarget as HTMLDivElement;
    target.contentEditable = "true";
    target.focus();

    // Select all text
    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(target);
    selection?.removeAllRanges();
    selection?.addRange(range);
  };

  const handleBlur = (e: React.FocusEvent<HTMLDivElement>) => {
    e.currentTarget.contentEditable = "false";
    const newText = e.currentTarget.textContent || layer.props.text;

    if (newText !== layer.props.text) {
      actions.updateLayer(layer.id, {
        ...layer.props,
        text: newText,
      });
      actions.saveToHistory();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Allow Enter key for new lines
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      document.execCommand("insertLineBreak");
    }

    // Prevent propagation of keyboard events to avoid triggering global shortcuts
    e.stopPropagation();
  };

  useEffect(() => {
    if (layerRef.current) {
      resizeObserverRef.current = new ResizeObserver((entries) => {
        const { width, height } = entries[0].contentRect;
        actions.updateLayer(layer.id, {
          boxData: {
            ...layer.boxData,
            size: { width, height },
          },
        });
      });

      resizeObserverRef.current.observe(layerRef.current);
    }

    return () => {
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
      }
    };
  }, [layer.id, actions]);

  const textStyles: React.CSSProperties = {
    fontFamily: layer.fontFamily || "Inter",
    fontSize: `${layer.fontSize || 16}px`,
    fontWeight: layer.styles?.bold ? "bold" : "normal",
    fontStyle: layer.styles?.italic ? "italic" : "normal",
    textDecoration: layer.styles?.underline ? "underline" : "none",
    color: layer.color || "#000000",
    textAlign: layer.textAlign || "left",
    letterSpacing: layer.letterSpacing || "normal",
    lineHeight: layer.lineHeight || "normal",
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent:
      layer.textAlign === "center"
        ? "center"
        : layer.textAlign === "right"
        ? "flex-end"
        : "flex-start",
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
    padding: "4px 8px",
    userSelect: "none",
    WebkitFontSmoothing: "antialiased",
    MozOsxFontSmoothing: "grayscale",
    cursor: "default",
    outline: "none",
  };

  return (
    <div
      {...props}
      style={{ position: "absolute", ...props.style }}
      className="group"
    >
      <div
        style={textStyles}
        onDoubleClick={handleDoubleClick}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
      >
        {layer.text}
      </div>
    </div>
  );
}
