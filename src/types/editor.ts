import type { BoxData, BoxSize, CursorPosition, Delta, FontData } from "./common"
import { Layer, LayerId } from "./layer"
import { TextEditor } from "@/utils/interfaces"
import { ActionMethods } from "@/lib/actions"
import { QueryMethods } from "@/utils/query"
import { Direction } from "./resize"


export type DataConfig = {
  name: string
  editorConfig: any
}

export type ImageEditorData = {
  layerId: LayerId
  position: Delta
  rotate: number
  boxSize: BoxSize
  image?: {
    url: string
    position: Delta
    rotate: number
    boxSize: BoxSize
  } | null
}
export type SidebarType = "TEXT_EFFECT" | "FONT_FAMILY" | "LAYER_MANAGEMENT" | "CHOOSING_COLOR"

export interface EditorState {
  name: string
  selectedLayers: LayerId[]
  hoveredLayer: LayerId | null
  sideBarOpen: boolean;
  sideBarTab: string | null;
  sideBarItems: Array<{
    id: string;
    isOpen: boolean;
  }>;
  openMenu: {
    clientX: number
    clientY: number
  } | null
  imageEditor?: {
    layerId: LayerId
    position: Delta
    rotate: number
    boxSize: BoxSize
    image?: {
      url: string
      position: Delta
      rotate: number
      boxSize: BoxSize
    } | null
  }
  textEditor?: {
    layerId: LayerId
    editor: TextEditor | null
  }
  controlBox?: BoxData
  pageSize: BoxSize
  layers: Record<string, Layer>;
  fontList: FontData[]
  resizeData: {
    status: boolean
    layerIds?: LayerId[]
    direction?: Direction
    rotate?: number
    boxSize?: BoxSize
    cursor?: CursorPosition
  }
  selectData: {
    status: boolean
  }
  dragData: {
    status: boolean
    layerIds?: LayerId[]
    position?: Delta
    cursor?: CursorPosition
  }
  rotateData: {
    status: boolean
    rotate?: number
    cursor?: CursorPosition
  }
  scale: number
  saving: boolean
  canvasSize: {
    width: number;
    height: number;
  };
  history?: Array<{
    layers: Record<string, Layer>
    selectedLayers: LayerId[]
    scale: number
  }>
  notes: string
}

export type CoreEditorActions = ReturnType<typeof ActionMethods>

export type HistoryActions = {
  undo: () => void
  redo: () => void
  clear: () => void
  new: () => void
  merge: () => CoreEditorActions
  back: () => void
}

export type CoreEditorQuery = ReturnType<typeof QueryMethods>

export interface EditorQuery extends CoreEditorQuery {
  history: HistoryActions
  export: {
    toPNG: () => Promise<string>
    toPDF: () => Promise<void>
  }
}

export type EditorActions = CoreEditorActions & {
  history: HistoryActions
}
