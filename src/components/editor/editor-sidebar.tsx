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
  FileText,
  FileImage,
} from "lucide-react"
import { useIsMobile } from "@/hooks/use-mobile"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ImageLayer, TextLayer } from "@/types/layer"
import texts from "@/api/json/texts.json";
import shapesData from "@/api/json/shapes.json";
import framesData from "@/api/json/frames.json";
import { Notes } from "./notes";

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
  {
    id: "notes",
    name: "Notes",
    icon: <FileText className="h-5 w-5" />,
  },
];

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
    case "notes":
      return <Notes />
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
  );
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

  const addTextFromTemplate = (template: any) => {
    try {
      const templateData = JSON.parse(template.data);
      const textLayers = Object.values(templateData.layers).filter(
        (layer: any) => layer.type?.resolvedName === "TextLayer"
      );

      textLayers.forEach((textLayer: any) => {
        const props = textLayer.props;
        const text = props.text.replace(/<[^>]+>/g, "").trim();
        const styleStr = props.text.match(/style="([^"]*)"/)?.[1] || "";
        const styles = Object.fromEntries(
          styleStr
            .split(";")
            .map((style: string) => style.split(":").map((s) => s.trim()))
            .filter(([k]: [string, string]) => k)
        );

        const newLayer: TextLayer = {
          id: `text-${Date.now()}-${Math.random()}`,
          type: "text",
          text,
          fontFamily: styles["font-family"]?.replace(/['"]/g, "") || "Inter",
          fontSize: parseInt(styles["font-size"]) || 16,
          color: props.colors?.[0] || styles.color || "#000000",
          textAlign: styles["text-align"] || "left",
          boxData: {
            position: { x: 100, y: 100 },
            boxSize: { width: 300, height: 100 },
            rotate: 0,
          },
          opacity: 1,
          zIndex: Date.now(),
        };
        actions.addLayer(newLayer);
      });
      actions.saveToHistory();
    } catch (error) {
      console.error("Error creating text layer:", error);
    }
  };

  const parseTemplateStyles = (templateData: string) => {
    try {
      const data = JSON.parse(templateData);
      const textLayer = Object.values(data.layers).find(
        (layer: any) => layer.type?.resolvedName === "TextLayer"
      ) as any;

      if (!textLayer) return null;

      const html = textLayer.props.text;
      const styleStr = html.match(/style="([^"]*)"/)?.[1] || "";
      const styles = Object.fromEntries(
        styleStr
          .split(";")
          .map((style: string) => style.split(":").map((s: string) => s.trim()))
          .filter(([k]: [string, string]) => k)
      );

      const previewFontSize = Math.min(
        parseInt(styles["font-size"]) * 0.25 || 14,
        18
      );

      return {
        html: textLayer.props.text,
        styles: {
          fontFamily: textLayer.props.fonts?.[0]?.family || "Inter",
          fontSize: previewFontSize,
          color: textLayer.props.colors?.[0] || styles.color || "#000000",
          textAlign: styles["text-align"] || "center",
          lineHeight: "1",
          letterSpacing: styles["letter-spacing"] || "normal",
        },
      };
    } catch (error) {
      return null;
    }
  };

  return (
    <div className="p-4 space-y-4">
      <div>
        <h3 className="font-medium mb-2">Quick Add</h3>
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

      <div>
        <h3 className="font-medium mb-2">Text Templates</h3>
        <div className="grid grid-cols-1 gap-1">
          {texts.data.map((template, index) => {
            const parsed = parseTemplateStyles(template.data);
            if (!parsed) return null;

            return (
              <Button
                key={index}
                variant="outline"
                className="w-full h-8 relative group bg-background hover:bg-accent/5 overflow-hidden px-2"
                onClick={() => addTextFromTemplate(template)}
              >
                <div
                  className="w-full flex items-center justify-center text-center"
                  dangerouslySetInnerHTML={{ __html: parsed.html }}
                  style={{
                    ...parsed.styles,
                    transform: "scale(0.8)",
                    transformOrigin: "center",
                    margin: "-8px 0",
                  }}
                />
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-200 bg-accent/10 flex items-center justify-center">
                  <span className="text-[10px] font-medium bg-background/90 px-1.5 py-0.5 rounded">
                    {template.desc}
                  </span>
                </div>
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
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

  const addShapeLayer = (shape: any) => {
    const newLayer = {
      id: `shape-${Date.now()}`,
      type: "shape" as const,
      shapeType: shape.shapeType,
      clipPath: shape.clipPath,
      color: shape.background || "#4f46e5",
      boxData: {
        position: { x: 100, y: 100 },
        boxSize: {
          width: parseInt(shape.width, 10) || 100,
          height: parseInt(shape.height, 10) || 100,
        },
        rotate: 0,
      },
      opacity: 1,
      zIndex: Date.now(),
    };

    actions.addLayer(newLayer);
    actions.saveToHistory();
  };

  return (
    <div className="p-4">
      <h3 className="font-medium mb-4">Shapes</h3>
      <div className="flex flex-wrap gap-4">
        {shapesData.data.map((shape, index) => (
          <Button
            key={index}
            variant="outline"
            className="w-[120px] h-[120px] p-0 relative group hover:bg-accent/5"
            onClick={() => addShapeLayer(shape)}
          >
            <div className="w-full h-full flex items-center justify-center">
              <div
                className="w-full h-full"
                style={{
                  clipPath: shape.clipPath
                    ? `path('${shape.clipPath}')`
                    : "none",
                  backgroundColor: shape.background || "#4f46e5",
                  transform: "scale(0.9)", // Scale down slightly to fit
                  transformOrigin: "center",
                }}
              />
            </div>
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-accent/10 backdrop-blur-[1px] flex items-center justify-center">
              <span className="text-xs font-medium bg-background/90 px-1 py-0.5 rounded">
                {shape.desc}
              </span>
            </div>
          </Button>
        ))}
      </div>
    </div>
  )
}

function FrameContent() {
  const { actions } = useEditor()

  const addFrameLayer = (frame: any) => {
    const newLayer = {
      id: `frame-${Date.now()}`,
      type: "frame" as const,
      image: frame.img.replace("http://localhost:4000", "/api"),
      background: frame.background,
      boxData: {
        position: { x: 100, y: 100 },
        boxSize: {
          width: parseInt(frame.width, 10) || 300,
          height: parseInt(frame.height, 10) || 200,
        },
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
      <div className="flex flex-wrap gap-2">
        {framesData.data.map((frame, index) => (
          <Button
            key={index}
            variant="outline"
            className="w-[48%] aspect-video relative group hover:bg-accent/5 p-2"
            onClick={() => addFrameLayer(frame)}
          >
            <div className="w-full h-full flex items-center justify-center">
              <img
                src={frame.img.replace("http://localhost:4000", "/api")}
                alt={frame.desc}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-accent/10 backdrop-blur-[1px] flex items-center justify-center">
              <span className="text-[10px] font-medium bg-background/90 px-1.5 py-0.5 rounded">
                {frame.desc}
              </span>
            </div>
          </Button>
        ))}
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
        <p className="text-sm text-muted-foreground">
          Drag and drop files here or click to upload
        </p>
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
