"use client"

import type React from "react"

import { useEditor } from "./editor-context"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  LayoutTemplate,
  Type,
  ImageIcon,
  Square,
  Frame,
  Upload,
  Heading1,
  Heading2,
  TextIcon,
  Circle,
  Triangle,
  Star,
  FileImage,
} from "lucide-react"
import { useIsMobile } from "@/hooks/use-mobile"
import { ScrollArea } from "@/components/ui/scroll-area"
import { FrameLayer, ImageLayer, ShapeLayer, TextLayer } from "@/types/layer"

const tabs = [
  {
    id: "template",
    name: "Template",
    icon: <LayoutTemplate className="h-5 w-5" />,
  },
  {
    id: "text",
    name: "Text",
    icon: <Type className="h-5 w-5" />,
  },
  {
    id: "image",
    name: "Image",
    icon: <ImageIcon className="h-5 w-5" />,
  },
  {
    id: "shape",
    name: "Shape",
    icon: <Square className="h-5 w-5" />,
  },
  {
    id: "frame",
    name: "Frame",
    icon: <Frame className="h-5 w-5" />,
  },
  {
    id: "upload",
    name: "Upload",
    icon: <Upload className="h-5 w-5" />,
  },
]

export function EditorSidebar() {
  const { state, actions } = useEditor()
  const isMobile = useIsMobile()

  const handleTabClick = (tabId: string) => {
    actions.setSidebarTab(state.sideBarTab === tabId ? null : tabId)
  }

  return (
    <div className="flex h-full bg-background border-r">
      <div className="flex flex-col w-[70px] border-r">
        {tabs.map((tab) => (
          <Button
            key={tab.id}
            variant="ghost"
            className={cn(
              "flex flex-col items-center justify-center h-[70px] rounded-none gap-1 px-0",
              state.sideBarTab === tab.id && "bg-accent text-accent-foreground",
            )}
            onClick={() => handleTabClick(tab.id)}
          >
            {tab.icon}
            <span className="text-xs">{tab.name}</span>
          </Button>
        ))}
      </div>

      {state.sideBarTab && !isMobile && (
        <div className="w-[280px] overflow-hidden">
          <ScrollArea className="h-full">
            <SidebarContent tab={state.sideBarTab} />
          </ScrollArea>
        </div>
      )}
    </div>
  )
}

function SidebarContent({ tab }: { tab: string }) {
  switch (tab) {
    case "template":
      return <TemplateContent />
    case "text":
      return <TextContent />
    case "image":
      return <ImageContent />
    case "shape":
      return <ShapeContent />
    case "frame":
      return <FrameContent />
    case "upload":
      return <UploadContent />
    default:
      return null
  }
}

function TemplateContent() {
  return (
    <div className="p-4">
      <h3 className="font-medium mb-4">Templates</h3>
      <div className="grid grid-cols-2 gap-2">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="aspect-square bg-muted rounded-md cursor-pointer hover:bg-accent transition-colors" />
        ))}
      </div>
    </div>
  )
}

function TextContent() {
  const { actions } = useEditor()

  const addTextLayer = (fontSize: number, text: string) => {
    const newLayer: TextLayer = {
      id: `text-${Date.now()}`,
      type: "text",
      text: text,
      fontSize: fontSize,
      fontFamily: "Inter",
      color: "#000000",
      textAlign: "left",
      boxData: {
        position: { x: 100, y: 100 },
        boxSize: { width: 300, height: fontSize * 1.5 },
        rotate: 0,
      },  
      
      opacity: 1,
      zIndex: Date.now(),
    }

    actions.addLayer(newLayer)
    actions.saveToHistory()
  }

  return (
    <div className="p-4">
      <h3 className="font-medium mb-4">Text</h3>
      <div className="space-y-2">
        <div
          className="p-3 bg-muted rounded-md cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors flex items-center gap-2"
          onClick={() => addTextLayer(32, "Add a heading")}
        >
          <Heading1 className="h-5 w-5" />
          <p className="text-2xl">Add a heading</p>
        </div>
        <div
          className="p-3 bg-muted rounded-md cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors flex items-center gap-2"
          onClick={() => addTextLayer(24, "Add a subheading")}
        >
          <Heading2 className="h-5 w-5" />
          <p className="text-xl">Add a subheading</p>
        </div>
        <div
          className="p-3 bg-muted rounded-md cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors flex items-center gap-2"
          onClick={() => addTextLayer(16, "Add a little bit of body text")}
        >
          <TextIcon className="h-5 w-5" />
          <p className="text-base">Add body text</p>
        </div>
      </div>
    </div>
  )
}

function ImageContent() {
  const { actions } = useEditor()

  const addImageLayer = (url: string) => {
    const newLayer : ImageLayer= {
      id: `image-${Date.now()}`,
      type: "image" as const,
      url: url,
      boxData:{
        position: { x: 100, y: 100 },
        boxSize: { width: 300, height: 200 },
        rotate: 0,
      },
      opacity: 1,
      zIndex: Date.now(),
    }

    actions.addLayer(newLayer)
    actions.saveToHistory()
  }

  return (
    <div className="p-4">
      <h3 className="font-medium mb-4">Images</h3>
      <div className="grid grid-cols-2 gap-2">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="aspect-square bg-muted rounded-md cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors flex items-center justify-center"
            onClick={() => addImageLayer(`/placeholder.svg?height=300&width=300`)}
          >
            <ImageIcon className="h-8 w-8 opacity-50" />
          </div>
        ))}
      </div>
    </div>
  )
}

function ShapeContent() {
  const { actions } = useEditor()

  const addShapeLayer = (shape: string) => {
    const newLayer : ShapeLayer= {
      id: `shape-${Date.now()}`,
      type: "shape" as const,
      shapeType: shape as "rectangle" | "circle" | "triangle" | "star",
      color: "#4f46e5",
      boxData: {
        position: { x: 100, y: 100 },
        boxSize: { width: 100, height: 100 },
        rotate: 0,
      },
      opacity: 1,
      zIndex: Date.now(),
    }

    actions.addLayer(newLayer)
    actions.saveToHistory()
  }

  return (
    <div className="p-4">
      <h3 className="font-medium mb-4">Shapes</h3>
      <div className="grid grid-cols-3 gap-2">
        <div
          className="aspect-square bg-muted rounded-md flex items-center justify-center cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors"
          onClick={() => addShapeLayer("rectangle")}
        >
          <Square className="h-8 w-8" />
        </div>
        <div
          className="aspect-square bg-muted rounded-md flex items-center justify-center cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors"
          onClick={() => addShapeLayer("circle")}
        >
          <Circle className="h-8 w-8" />
        </div>
        <div
          className="aspect-square bg-muted rounded-md flex items-center justify-center cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors"
          onClick={() => addShapeLayer("triangle")}
        >
          <Triangle className="h-8 w-8" />
        </div>
        <div
          className="aspect-square bg-muted rounded-md flex items-center justify-center cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors"
          onClick={() => addShapeLayer("star")}
        >
          <Star className="h-8 w-8" />
        </div>
      </div>
    </div>
  )
}

function FrameContent() {
  const { actions } = useEditor()

  const addFrameLayer = (background: string) => {
    const newLayer : FrameLayer= {
      id: `frame-${Date.now()}`,
      type: "frame" as const,
      background: background,
      boxData:{
        position: { x: 100, y: 100 },
        boxSize: { width: 300, height: 200 },
        rotate: 0,
      },
      opacity: 1,
      zIndex: Date.now(),
    }

    actions.addLayer(newLayer)
    actions.saveToHistory()
  }

  return (
    <div className="p-4">
      <h3 className="font-medium mb-4">Frames</h3>
      <div className="grid grid-cols-2 gap-2">
        <div
          className="aspect-video bg-muted rounded-md cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors flex items-center justify-center"
          onClick={() => addFrameLayer("#f3f4f6")}
        >
          <Frame className="h-8 w-8 opacity-50" />
        </div>
        <div
          className="aspect-video bg-muted rounded-md cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors flex items-center justify-center"
          onClick={() => addFrameLayer("#f0f9ff")}
        >
          <Frame className="h-8 w-8 opacity-50" />
        </div>
        <div
          className="aspect-video bg-muted rounded-md cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors flex items-center justify-center"
          onClick={() => addFrameLayer("#f0fdf4")}
        >
          <Frame className="h-8 w-8 opacity-50" />
        </div>
        <div
          className="aspect-video bg-muted rounded-md cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors flex items-center justify-center"
          onClick={() => addFrameLayer("#fef2f2")}
        >
          <Frame className="h-8 w-8 opacity-50" />
        </div>
      </div>
    </div>
  )
}

function UploadContent() {
  const { actions } = useEditor()

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const url = event.target?.result as string

        // Create an image layer with the uploaded image
        const newLayer: ImageLayer = {
          id: `image-${Date.now()}`,
          type: "image",
          url,
          boxData:{
            position: { x: 100, y: 100 },
            boxSize: { width: 300, height: 200 },
            rotate: 0,
          },
          opacity: 1,
          zIndex: Date.now(),
        }

        actions.addLayer(newLayer)
        actions.saveToHistory()
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="p-4">
      <h3 className="font-medium mb-4">Upload</h3>
      <div className="border-2 border-dashed border-muted-foreground/20 rounded-md p-8 text-center">
        <FileImage className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">Drag and drop files here or click to upload</p>
        <Button variant="outline" className="mt-4 relative">
          Upload Files
          <input
            type="file"
            className="absolute inset-0 opacity-0 cursor-pointer"
            accept="image/*"
            onChange={handleFileUpload}
          />
        </Button>
      </div>
    </div>
  )
}
