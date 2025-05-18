"use client"

import { useState } from "react"
import { EditorHeader } from "./editor-header"
import { EditorSidebar } from "./editor-sidebar"
import { EditorCanvas } from "./editor-canvas"
import { EditorProvider } from "./editor-context"
import { PageControl } from "../PageControl"
import { Notes } from "./notes"
import { cn } from "@/lib/utils"
import { useEditor } from "@/hooks"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import { ThreeDPreview } from "../3d-preview"

export function Editor() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const { state } = useEditor()

  return (
    <EditorProvider>
      <div className="flex flex-col w-full h-screen max-h-[100vh] bg-background">
        <EditorHeader
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          onToggleSettings={() => setSettingsOpen(!settingsOpen)}
        />
        <div className="flex flex-1 overflow-hidden">
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
            <ResizablePanelGroup direction="horizontal" className="flex-1">
              <ResizablePanel defaultSize={60} minSize={30}>
                <EditorCanvas />
              </ResizablePanel>
              <ResizableHandle withHandle />
              <ResizablePanel defaultSize={40} minSize={20}>
                <ThreeDPreview />
              </ResizablePanel>
            </ResizablePanelGroup>
            <div className="h-12 border-t border-border flex items-center justify-center">
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
