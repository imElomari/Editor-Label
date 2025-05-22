"use client";

import { useEditor } from "./editor-context";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Copy,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useEffect, useState } from "react";
import { ColorPicker } from "../ui/color-picker";
import { TextStyleControls } from "./layers/texts/TextStyleControls";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const fontSizes = [
  { value: "12", label: "12" },
  { value: "14", label: "14" },
  { value: "16", label: "16" },
  { value: "18", label: "18" },
  { value: "20", label: "20" },
  { value: "24", label: "24" },
  { value: "28", label: "28" },
  { value: "32", label: "32" },
  { value: "36", label: "36" },
  { value: "42", label: "42" },
  { value: "48", label: "48" },
  { value: "56", label: "56" },
  { value: "64", label: "64" },
];

export function Toolbar() {
  const { state, actions } = useEditor();
  const [selectedColor, setSelectedColor] = useState("#000000");

  const hasSelectedLayer = state.selectedLayerIds.length > 0;
  const selectedLayer = hasSelectedLayer
    ? state.page.layers[state.selectedLayerIds[0]]
    : null;
  const isTextLayer = selectedLayer?.type === "text";

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
    if (selectedLayer) {
      if (selectedLayer.type === "text") {
        actions.updateLayer(selectedLayer.id, {
          color: color
        });
      } else if (selectedLayer.type === "shape") {
        actions.updateLayer(selectedLayer.id, {
          color: color,
        });
      }
      actions.saveToHistory();
    }
  };

  const handleDuplicate = () => {
    if (selectedLayer) {
      const newLayer = {
        ...selectedLayer,
        id: `${selectedLayer.type}-${Date.now()}`,
        boxData: {
          ...selectedLayer.boxData,
          position: {
            x: selectedLayer.boxData.position.x + 20,
            y: selectedLayer.boxData.position.y + 20,
          },
        },
      };
      actions.addLayer(newLayer);
      actions.saveToHistory();
    }
  };

  const handleTextAlign = (align: string) => {
    if (isTextLayer) {
      actions.updateLayer(selectedLayer.id, {
        textAlign: align as "left" | "center" | "right",
      });
      actions.saveToHistory();
    }
  };

  const handleFontSizeChange = (value: string) => {
    if (isTextLayer && selectedLayer) {
      actions.updateLayer(selectedLayer.id, {
        fontSize: parseInt(value),
      });
      actions.saveToHistory();
    }
  };

  // Effect to update color picker when selected layer changes
  useEffect(() => {
    if (selectedLayer) {
      if (selectedLayer.type === "text" && selectedLayer.color) {
        setSelectedColor(selectedLayer.color);
      } else if (selectedLayer.type === "shape" && selectedLayer.color) {
        setSelectedColor(selectedLayer.color);
      }
    }
  }, [selectedLayer]);

  return (
    <TooltipProvider>
      <div className="border-b border-border bg-muted/40 p-1 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {/* Basic Tools Section */}
          <div className="flex items-center space-x-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() =>
                    actions.setScale(Math.max(0.1, state.scale - 0.1))
                  }
                >
                  <ZoomOut className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Zoom Out</TooltipContent>
            </Tooltip>

            <span className="text-xs font-medium bg-background px-2 py-1 rounded-md">
              {Math.round(state.scale * 100)}%
            </span>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() =>
                    actions.setScale(Math.min(5, state.scale + 0.1))
                  }
                >
                  <ZoomIn className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Zoom In</TooltipContent>
            </Tooltip>
          </div>

          <Separator orientation="vertical" className="h-8" />

          {/* Layer Actions (only visible when a layer is selected) */}
          {hasSelectedLayer && (
            <div className="flex items-center space-x-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={handleDuplicate}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Duplicate</TooltipContent>
              </Tooltip>
            </div>
          )}

          {/* Text formatting (only visible when a text layer is selected) */}
          {isTextLayer && (
            <>
              <Separator orientation="vertical" className="h-8" />
              <div className="flex items-center space-x-1">
                {/* Color picker */}
                {hasSelectedLayer && isTextLayer && (
                  <div className="flex items-center space-x-2 px-2">
                    <ColorPicker
                      color={selectedColor}
                      onChange={handleColorChange}
                    />
                  </div>
                )}
                <ToggleGroup
                  type="single"
                  value={selectedLayer.textAlign || "left"}
                  onValueChange={handleTextAlign}
                >
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <ToggleGroupItem
                        value="left"
                        aria-label="Align left"
                        className="h-8 w-8 p-0"
                      >
                        <AlignLeft className="h-4 w-4" />
                      </ToggleGroupItem>
                    </TooltipTrigger>
                    <TooltipContent>Align Left</TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <ToggleGroupItem
                        value="center"
                        aria-label="Align center"
                        className="h-8 w-8 p-0"
                      >
                        <AlignCenter className="h-4 w-4" />
                      </ToggleGroupItem>
                    </TooltipTrigger>
                    <TooltipContent>Align Center</TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <ToggleGroupItem
                        value="right"
                        aria-label="Align right"
                        className="h-8 w-8 p-0"
                      >
                        <AlignRight className="h-4 w-4" />
                      </ToggleGroupItem>
                    </TooltipTrigger>
                    <TooltipContent>Align Right</TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <ToggleGroupItem
                        value="justify"
                        aria-label="Justify"
                        className="h-8 w-8 p-0"
                      >
                        <AlignJustify className="h-4 w-4" />
                      </ToggleGroupItem>
                    </TooltipTrigger>
                    <TooltipContent>Justify</TooltipContent>
                  </Tooltip>
                </ToggleGroup>

                <Separator orientation="vertical" className="h-6" />
                <TextStyleControls />

                {/* Font size control */}
                <div className="flex items-center space-x-1">
                  <Select
                    value={selectedLayer.fontSize?.toString()}
                    onValueChange={handleFontSizeChange}
                  >
                    <SelectTrigger className="w-[80px] h-8">
                      <SelectValue placeholder="Size" />
                    </SelectTrigger>
                    <SelectContent>
                      {fontSizes.map((size) => (
                        <SelectItem key={size.value} value={size.value}>
                          {size.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </>
          )}

          {/* Shape controls - only show color picker when shape is selected */}
          {selectedLayer?.type === "shape" && (
            <div className="flex items-center space-x-2">
              <ColorPicker color={selectedColor} onChange={handleColorChange} />
            </div>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <Separator orientation="vertical" className="h-8" />
        </div>
      </div>
    </TooltipProvider>
  );
}
