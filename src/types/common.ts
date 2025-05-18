export type BoxSize = {
  width: number
  height: number
}
export type Delta = {
  x: number
  y: number
}

export type BoxData = {
  boxSize: BoxSize;
  position: Delta;
  rotate: number;
  scale?: number;
};

export type CursorPosition = {
  clientX: number
  clientY: number
}

export type FontStyle = {
  name: string
  style: string
  url: string
}

export type FontData = {
  name: string
  family: string
  style: string
  url: string
  styles?: FontData[]
}

export type HorizontalGuideline = {
  y: number
  x1: number
  x2: number
  label?: string
}
export type VerticalGuideline = {
  x: number
  y1: number
  y2: number
  label?: string
}

export type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>
    }
  : T

export type Rect = {
  x: number
  y: number
  width: number
  height: number
}

