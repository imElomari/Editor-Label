import type { EditorState } from "../components/editor/editor-context"

// Data mapping for compression
export const dataMapping: Record<string, string> = {
  // Single character mappings (a-z)
  name: 'a',
  notes: 'b',
  layers: 'c',
  ROOT: 'd',
  type: 'e',
  resolvedName: 'f',
  props: 'g',
  boxSize: 'h',
  width: 'i',
  height: 'j',
  position: 'k',
  x: 'l',
  y: 'm',
  rotate: 'n',
  color: 'o',
  image: 'p',
  gradientBackground: 'q',
  locked: 'r',
  child: 's',
  parent: 't',
  scale: 'u',
  text: 'v',
  fonts: 'w',
  family: 'x',
  url: 'y',
  style: 'z',

  // Double character mappings (aa-ao)
  styles: 'aa',
  colors: 'ab',
  fontSizes: 'ac',
  effect: 'ad',
  settings: 'ae',
  thickness: 'af',
  transparency: 'ag',
  clipPath: 'ah',
  shapeSize: 'ai',
  thumb: 'aj',
  offset: 'ak',
  direction: 'al',
  blur: 'am',
  border: 'an',
  weight: 'ao'
}

function unpack(packed: any): any {
  if (!packed) return packed
  if (Array.isArray(packed)) {
    return packed.map(item => unpack(item))
  }

  if (typeof packed === 'object') {
    const unpackedObj: Record<string, any> = {}
    for (const key in packed) {
      if (packed.hasOwnProperty(key)) {
        const originalKey = Object.keys(dataMapping).find(k => dataMapping[k] === key) || key
        unpackedObj[originalKey] = unpack(packed[key])
      }
    }
    return unpackedObj
  }

  return packed
}

export function exportDesignToJSON(state: EditorState): string {
  const transformLayer = (layer: any) => {
    return {
      [dataMapping.type]: {
        [dataMapping.resolvedName]: `${layer.type}Layer`
      },
      [dataMapping.props]: {
        [dataMapping.text]: layer.text || '',
        [dataMapping.fontSize]: layer.fontSize || 16,
        [dataMapping.family]: layer.fontFamily || 'sans-serif',
        [dataMapping.color]: layer.color || '#000000',
        [dataMapping.textAlign]: layer.textAlign || 'left',
        [dataMapping.position]: {
          [dataMapping.x]: layer.position?.x || 0,
          [dataMapping.y]: layer.position?.y || 0
        },
        [dataMapping.boxSize]: {
          [dataMapping.width]: layer.boxSize?.width || 100,
          [dataMapping.height]: layer.boxSize?.height || 100
        },
        [dataMapping.rotate]: layer.rotate || 0,
        [dataMapping.scale]: layer.scale || 1
      },
      [dataMapping.locked]: layer.locked || false,
      [dataMapping.visible]: true,
      [dataMapping.timestamp]: Date.now()
    }
  }
  
    const exportData = {
      [dataMapping.name]: state.page.name || "Untitled",
      [dataMapping.pageSize]: {
        [dataMapping.width]: state.page.size.width,
        [dataMapping.height]: state.page.size.height
      },
      [dataMapping.layers]: Object.entries(state.page.layers).reduce((acc, [id, layer]) => {
        acc[id] = transformLayer(layer)
        return acc
      }, {} as Record<string, any>),
      [dataMapping.notes]: state.notes || ""
    }
  
    return JSON.stringify(exportData, null, 2)
  }

export function saveDesignAsFile(state: EditorState): void {
  const jsonString = exportDesignToJSON(state)
  const blob = new Blob([jsonString], { type: "application/json" })
  const url = URL.createObjectURL(blob)

  const a = document.createElement("a")
  a.href = url
  a.download = `${state.page.name.replace(/[^a-z0-9]/gi, "_").toLowerCase()}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export function importDesignFromJSON(jsonString: string): Partial<EditorState> {
  try {
    const packedData = JSON.parse(jsonString)
    const importedData = unpack(packedData)

    if (!importedData.pageSize || !importedData.layers) {
      throw new Error("Invalid design file format")
    }

    return {
      page: {
        name: importedData.name || "Imported Design",
        size: importedData.pageSize,
        layers: importedData.layers,
        notes: importedData.notes || "",
      },
      selectedLayerIds: [],
      hoveredLayer: null,
      scale: 1,
      sideBarTab: null,
      settingsOpen: false,
      history: {
        past: [],
        future: [],
      },
    }
  } catch (error) {
    console.error("Failed to import design:", error)
    throw error
  }
}