import { Layer } from "./layer"

export type PageSize = {
  width: number
  height: number
}

export type Page = {
  layers: Record<string, Layer>
  name: string
  notes: string
  size: PageSize
}
