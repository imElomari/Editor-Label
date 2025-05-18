import { EditorState } from '@/types/editor'
import { Layer, LayerId } from '@/types/layer'
import { BoxSize } from '@/types/common'

export const QueryMethods = (state: EditorState) => {
  return {
    getPageSize(): BoxSize {
      return state.pageSize || {
        width: 1200,
        height: 800
      }
    },

    getLayers(): Record<LayerId, Layer> {
      return state.layers || {}
    },

    getLayer(layerId: LayerId): Layer | undefined {
      return state.layers[layerId]
    },

    getSelectedLayers(): Layer[] {
      return state.selectedLayers
        .map(id => state.layers[id])
        .filter((layer): layer is Layer => layer !== undefined)
    },

    getHoveredLayer(): Layer | undefined {
      return state.hoveredLayer ? state.layers[state.hoveredLayer] : undefined
    },

    getScale(): number {
      return state.scale || 1
    },

    serialize() {
      return {
        layers: state.layers,
        pageSize: this.getPageSize(),
        scale: this.getScale()
      }
    }
  }
}