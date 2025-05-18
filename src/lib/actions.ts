import { EditorState } from '@/types/editor'
import { ImageLayer, Layer, LayerId, ShapeLayer, TextLayer } from '@/types/layer'
import { BoxSize, Delta } from '@/types/common'

export const ActionMethods = (state: EditorState) => {
  return {
    toggleSidebarItem: (itemId: string) => ({
      type: "TOGGLE_SIDEBAR_ITEM",
      payload: itemId
    }),
    setSidebarTab: (tab: string | null) => ({
      type: "SET_SIDEBAR_TAB",
      payload: tab
    }),
    
    // Layer Management
    addLayer(layer: Layer) {
      state.layers[layer.id] = {
        ...layer,
        boxData: {
          boxSize: layer.boxData?.boxSize || { width: 0, height: 0 },
          position: layer.boxData?.position || { x: 0, y: 0 },
          rotate: layer.boxData?.rotate || 0
        }
      }
      state.selectedLayers = [layer.id]
    },

    updateLayer(layerId: LayerId, properties: Partial<Layer>) {
      if (state.layers[layerId]) {
        const existingLayer = state.layers[layerId];
        state.layers[layerId] = {
          ...existingLayer,
          ...properties,
          type: existingLayer.type // Ensure the type remains consistent
        } as Layer;
      }
    },

    deleteLayer(layerId: LayerId) {
      const { [layerId]: deletedLayer, ...remainingLayers } = state.layers
      state.layers = remainingLayers
      state.selectedLayers = state.selectedLayers.filter(id => id !== layerId)
    },

    // Selection Management
    selectLayer(layerId: LayerId) {
      state.selectedLayers = [layerId]
    },

    selectMultipleLayers(layerIds: LayerId[]) {
      state.selectedLayers = [...layerIds]
    },

    deselectAllLayers() {
      state.selectedLayers = []
    },

    // Layer Position and Size
    moveLayer(layerId: LayerId, position: Delta) {
      if (state.layers[layerId]) {
        state.layers[layerId].boxData.position = position
      }
    },

    resizeLayer(layerId: LayerId, size: BoxSize) {
      if (state.layers[layerId]) {
        state.layers[layerId].boxData.boxSize = size
      }
    },  

    // Scale Management
    setScale(scale: number) {
      state.scale = Math.max(0.1, Math.min(5, scale))
    },

    // History Management
    pushHistoryState() {
      if (state.history) {
        state.history.push({
          layers: { ...state.layers },
          selectedLayers: [...state.selectedLayers],
          scale: state.scale
        })
      }
    },

    // Factory Methods
    createTextLayer(text: string, position: Delta) {
      const layer: TextLayer = {
        id: crypto.randomUUID(),
        type: 'text',
        text: text,
        fontSize: 0,
        fontFamily: '',
        color: '',
        textAlign: 'left',
        boxData: {
          boxSize: {
            width: 0,
            height: 0
          },
          position: position,
          rotate: 0,
          scale: undefined
        },
        opacity: 0
      }
      this.addLayer(layer)
      return layer
    },

    createImageLayer(url: string, position: Delta, size: BoxSize) {
      const layer: ImageLayer = {
        id: crypto.randomUUID(),
        type: 'image',
        url: url,
        boxData: {
          boxSize: size,
          position: position,
          rotate: 0,
          scale: undefined
        },
        opacity: 0
      }
      this.addLayer(layer)
      return layer
    },

    createShapeLayer(shape: 'rectangle' | 'circle', position: Delta) {
      const layer: ShapeLayer = {
        id: crypto.randomUUID(),
        type: 'shape',
        shapeType: shape,
        color: '',
        boxData: {
          boxSize: {
            width: 0,
            height: 0
          },
          position: position,
          rotate: 0,
          scale: undefined
        },
        opacity: 0
      }
      this.addLayer(layer)
      return layer
    },
    setNotes(notes: string) {
      state.notes = notes
    },
  }
}