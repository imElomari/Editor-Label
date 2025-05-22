import type { ReactElement } from "react"
import type { BoxData, Delta } from "./common"
import type { EditorActions, EditorState } from "./editor"

// Basic Types
export type LayerId = string

export type LayerType = 'text' | 'image' | 'shape' | 'frame'


// Layer Properties
export interface LayerBase {
  id: LayerId
  type: LayerType
  boxData: BoxData
  opacity: number
  zIndex?: number
  parent?: LayerId | null
  children?: LayerId[]
}

// Specific Layer Types
export interface TextLayer extends LayerBase {
  type: 'text'
  text: string
  fontSize: number
  fontFamily: string
  color: string
  textAlign: 'left' | 'center' | 'right'
  styles?: {
    bold?: boolean
    italic?: boolean
    underline?: boolean
  }
}

export interface ImageLayer extends LayerBase {
  type: 'image'
  url: string
  alt?: string
  transparency?: number
}

export interface ShapeLayer extends LayerBase {
  type: 'shape'
  shapeType: ShapeType
  clipPath?: string
  color: string
  borderStyle?: ShapeBorderStyle
  borderWidth?: number
  borderColor?: string
}

export interface FrameLayer extends LayerBase {
  type: 'frame'
  background: string | GradientStyle
  padding?: number
  image?: string
}

// Union type for all layer types
export type Layer = TextLayer | ImageLayer | ShapeLayer | FrameLayer

// Utility Types
export type ShapeType =
  | "rectangle"
  | "circle"
  | "triangle"
  | "pentagon"
  | "hexagon"
  | "octagon"
  | "arrow"
  | "star"
  | "chat"

export type ShapeBorderStyle = "solid" | "dashed" | "dotted" | "none"

export type GradientStyle = 
  | "horizontal"
  | "vertical" 
  | "diagonal"
  | "radial"

// Context Menu
export interface ContextMenuItem {
  id: string
  label: string | ReactElement
  action: (data: {
    layerId: LayerId
    state: EditorState
    actions: EditorActions
  }) => void
  shortcut?: string
  icon?: ReactElement
}

// Layer Actions
export interface LayerActions {
  updateProps: (props: Partial<Layer>) => void
  select: () => void
  deselect: () => void
  remove: () => void
  duplicate: () => void
  moveUp: () => void
  moveDown: () => void
  show: () => void
  hide: () => void
}

// Serialization Types
export interface SerializedLayer {
  id: LayerId
  type: LayerType
  props: Record<string, unknown>
  parent: LayerId | null
  children: LayerId[]
}

export interface LayerComponentProps {
  position?: Delta;
  scale?: number;
}

export type LayerDataRef = Record<LayerId, BoxData>

export type LayerStore = Record<LayerId, Layer>