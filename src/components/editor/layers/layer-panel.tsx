"use client";

import { useState, useRef, useEffect } from "react";
import type React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";
import { Sortable, SortableItem } from "@/components/ui/sortable";
import { useEditor } from "@/hooks";

export function LayerPanel() {
  const { state, actions } = useEditor();

  const layersArray = Object.entries(state.page.layers)
    .map(([id, layer]) => ({ ...layer, id }))
    .sort((a: any, b: any) => (b.zIndex || 0) - (a.zIndex || 0));

  const handleReorder = (items: any[]) => {
    // Update zIndex for all layers
    items.forEach((layer, index) => {
      const zIndex = (items.length - index) * 10;
      actions.updateLayer(layer.id, { zIndex });
    });
    actions.saveToHistory();
  };

  return (
    <TooltipProvider>
      <div className="flex flex-col h-full bg-background border-t">

        {/* Layers List */}
        <div className="flex-1">
          <div className="p-4 border-b">
            <h3 className="text-sm font-medium">Layers</h3>
          </div>
          <ScrollArea>
            <div className="p-2">
              <Sortable items={layersArray} onReorder={handleReorder}>
                {layersArray.map((layer) => (
                  <LayerItem key={layer.id} layer={layer} />
                ))}
              </Sortable>
            </div>
          </ScrollArea>
        </div>
      </div>
    </TooltipProvider>
  );
}

function LayerItem({ layer }: { layer: any }) {
  const { state, actions } = useEditor();
  const [isEditing, setIsEditing] = useState(false);
  const [layerName, setLayerName] = useState(
    layer.name || getDefaultLayerName(layer)
  );
  const inputRef = useRef<HTMLInputElement>(null);
  const isSelected = state.selectedLayerIds.includes(layer.id);

  const handleSelectLayer = () => {
    actions.selectLayer(layer.id);
  };

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLayerName(e.target.value);
  };

  const handleNameBlur = () => {
    setIsEditing(false);
    actions.updateLayer(layer.id, { type: layerName });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      setIsEditing(false);
      actions.updateLayer(layer.id, { type: layerName });
    } else if (e.key === "Escape") {
      setIsEditing(false);
      setLayerName(layer.name || getDefaultLayerName(layer));
    }
  };

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleDeleteLayer = (e: React.MouseEvent) => {
    e.stopPropagation();
    actions.deleteLayer(layer.id);
    actions.saveToHistory();
  };

  return (
    <SortableItem id={layer.id}>
      <div
        className={cn(
          "flex items-center gap-2 p-2 rounded-md mb-1 select-none",
          isSelected ? "bg-accent text-accent-foreground" : "hover:bg-muted"
        )}
        onClick={handleSelectLayer}
        onDoubleClick={handleDoubleClick}
      >
        {isEditing ? (
          <Input
            ref={inputRef}
            value={layerName}
            onChange={handleNameChange}
            onBlur={handleNameBlur}
            onKeyDown={handleKeyDown}
            className="h-6 py-0 text-xs flex-1"
          />
        ) : (
          <div className="text-sm truncate flex-1">{layerName}</div>
        )}

        <div className="flex items-center gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={handleDeleteLayer}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Delete Layer</TooltipContent>
          </Tooltip>
        </div>
      </div>
    </SortableItem>
  );
}

function getDefaultLayerName(layer: any) {
  switch (layer.type) {
    case "text":
      return layer.text?.substring(0, 15) || "Text Layer";
    case "shape":
      return capitalizeFirstLetter(layer.shapeType || "Shape");
    case "image":
      return "Image";
    default:
      return "Layer";
  }
}

function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
