"use client"

import { useState } from "react"
import { EditorHeader } from "./editor-header"
import { EditorSidebar } from "./editor-sidebar"
import { EditorCanvas } from "./editor-canvas"
import { EditorProvider } from "./editor-context"
import { Notes } from "./notes"
import { cn } from "@/lib/utils"
import { useEditor } from "@/hooks"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import { Toolbar } from "./toolbar"
import { ThreeDPreview } from "../3d/3d-preview"
import { LayerPanel } from "./layers/layer-panel"
import { PageControl } from "../PageControl"

export function Editor() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const { state } = useEditor()

  return (
    <EditorProvider>
      <div className="flex flex-col w-full h-screen max-h-[100vh] bg-background overflow-hidden">
        <EditorHeader
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />
        <div className="flex-1 flex overflow-hidden relative">
          {/* Sidebar */}
          <div
            className={cn(
              "transition-all duration-300 overflow-hidden border-r border-border h-full",
              state.sideBarOpen ? "w-[300px]" : "w-0",
            )}
          >
            <EditorSidebar />
          </div>

          {/* Main content with resizable panels */}
          <div className="flex-1 flex flex-col overflow-hidden relative">
            <Toolbar />
            <ResizablePanelGroup direction="vertical" className="flex-1">
              <ResizablePanel defaultSize={70} minSize={30}>
                <ResizablePanelGroup direction="horizontal" className="h-full">
                  <ResizablePanel defaultSize={60} minSize={30}>
                    <EditorCanvas />
                  </ResizablePanel>
                  <ResizableHandle withHandle />
                  <ResizablePanel defaultSize={40} minSize={20}>
                    <ThreeDPreview />
                  </ResizablePanel>
                </ResizablePanelGroup>
              </ResizablePanel>
              <ResizableHandle withHandle />
              <ResizablePanel defaultSize={30} minSize={15}>
                <LayerPanel />
              </ResizablePanel>
            </ResizablePanelGroup>

            <div className="h-12 border-t border-border">
              <PageControl />
            </div>
          </div>

          {/* Settings panel */}
          <div
            className={cn(
              "transition-all duration-300 overflow-hidden border-l border-border h-full bg-background",
              state.notesOpen ? "w-[300px]" : "w-0",
            )}
          >
            <div className="h-full">{state.notesOpen && <Notes />}</div>
          </div>
        </div>
      </div>
    </EditorProvider>
  )
}
