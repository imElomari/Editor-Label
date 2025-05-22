"use client"

import { useEditor } from "./editor-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { X, Trash2 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

export function EditorSettings() {
  const { state, actions } = useEditor()

  if (!state.settingsOpen) return null

  const selectedLayer =
    state.selectedLayerIds.length === 1 ? state.page.layers[state.selectedLayerIds[0]] : null

  return (
    <div className="absolute right-0 top-0 bottom-0 w-[300px] bg-background border-l z-30 overflow-y-auto">
      <div className="flex items-center justify-between p-4 border-b">
        <h3 className="font-medium">Settings</h3>
        <Button variant="ghost" size="icon" onClick={() => actions.setSettingsOpen(false)}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="p-4">{selectedLayer ? <LayerSettings layer={selectedLayer} /> : <PageSettings />}</div>
    </div>
  )
}

function LayerSettings({ layer }: { layer: any }) {
  const { actions } = useEditor()

  const updateLayer = (props: any) => {
    actions.updateLayer(layer.id, props)
  }
  
  const deleteLayer = () => {
    actions.deleteLayer(layer.id)
    actions.setSettingsOpen(false)
  }

  // Ensure we have default values for all properties
  const position = layer.boxData?.position || { x: 0, y: 0 }
  const boxSize = layer.boxData?.boxSize || { width: 100, height: 100 }
  const rotate = layer.boxData?.rotate || 0
  const opacity = layer.opacity ?? 1

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h4 className="font-medium">{layer.type.charAt(0).toUpperCase() + layer.type.slice(1)} Settings</h4>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={deleteLayer} title="Delete">
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Position</Label>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-xs text-muted-foreground">X</Label>
              <Input
                type="number"
                value={position.x}
                onChange={(e) =>
                  updateLayer({
                    boxData: {
                      ...(layer.boxData || {}),
                      position: { ...position, x: Number(e.target.value) },
                    },
                  })
                }
              />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Y</Label>
              <Input
                type="number"
                value={position.y}
                onChange={(e) =>
                  updateLayer({
                    boxData: {
                      ...(layer.boxData || {}),
                      position: { ...position, y: Number(e.target.value) },
                    },
                  })
                }
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Size</Label>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-xs text-muted-foreground">Width</Label>
              <Input
                type="number"
                value={boxSize.width}
                onChange={(e) =>
                  updateLayer({
                    boxData: {
                      ...(layer.boxData || {}),
                      boxSize: { ...boxSize, width: Number(e.target.value) },
                    },
                  })
                }
              />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Height</Label>
              <Input
                type="number"
                value={boxSize.height}
                onChange={(e) =>
                  updateLayer({
                    boxData: {
                      ...(layer.boxData || {}),
                      boxSize: { ...boxSize, height: Number(e.target.value) },
                    },
                  })
                }
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Rotation ({Math.round(rotate)}°)</Label>
          <Slider
            value={[rotate]}
            min={0}
            max={360}
            step={1}
            onValueChange={(value) =>
              updateLayer({
                boxData: {
                  ...(layer.boxData || {}),
                  rotate: value[0],
                },
              })
            }
          />
        </div>

        <div className="space-y-2">
          <Label>Opacity ({Math.round(opacity * 100)}%)</Label>
          <Slider
            value={[opacity * 100]}
            min={0}
            max={100}
            step={1}
            onValueChange={(value) => updateLayer({ opacity: value[0] / 100 })}
          />
        </div>

        {layer.type === "text" && (
          <>
            <div className="space-y-2">
              <Label>Text</Label>
              <Input
                value={layer.props?.text || ""}
                onChange={(e) =>
                  updateLayer({
                    props: { ...(layer.props || {}), text: e.target.value },
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Font Size</Label>
              <Input
                type="number"
                value={layer.props?.fontSize || 16}
                onChange={(e) =>
                  updateLayer({
                    props: { ...(layer.props || {}), fontSize: Number(e.target.value) },
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Text Align</Label>
              <Select
                value={layer.props?.textAlign || "left"}
                onValueChange={(value) =>
                  updateLayer({
                    props: { ...(layer.props || {}), textAlign: value },
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Text Alignment" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="left">Left</SelectItem>
                  <SelectItem value="center">Center</SelectItem>
                  <SelectItem value="right">Right</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Color</Label>
              <div className="flex items-center gap-2">
                <div
                  className="w-8 h-8 rounded-full border"
                  style={{ backgroundColor: layer.props?.color || "#000000" }}
                />
                <Input
                  value={layer.props?.color || "#000000"}
                  onChange={(e) =>
                    updateLayer({
                      props: { ...(layer.props || {}), color: e.target.value },
                    })
                  }
                />
              </div>
            </div>
          </>
        )}

        {layer.type === "shape" && (
          <div className="space-y-2">
            <Label>Color</Label>
            <div className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-full border"
                style={{ backgroundColor: layer.props?.color || "#4f46e5" }}
              />
              <Input
                value={layer.props?.color || "#4f46e5"}
                onChange={(e) =>
                  updateLayer({
                    props: { ...(layer.props || {}), color: e.target.value },
                  })
                }
              />
            </div>
          </div>
        )}

        {layer.type === "frame" && (
          <div className="space-y-2">
            <Label>Background</Label>
            <div className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-full border"
                style={{ backgroundColor: layer.props?.background || "#f3f4f6" }}
              />
              <Input
                value={layer.props?.background || "#f3f4f6"}
                onChange={(e) =>
                  updateLayer({
                    props: { ...(layer.props || {}), background: e.target.value },
                  })
                }
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function PageSettings() {
  return (
    <div className="space-y-6">
      <h4 className="font-medium">Page Settings</h4>
    </div>
  )
}
