"use client"

import { Button } from "@/components/ui/button"
import { PanelLeft, Undo, Redo, Download, Trash2 } from "lucide-react"
import { useEditor } from "./editor-context"
import { exportToPNG } from "@/utils/exportToPNG"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Separator } from "@/components/ui/separator"
import { saveDesignAsFile } from "@/utils/exportDesign"
import { ModeToggle } from "../mode-toggle"

interface EditorHeaderProps {
  onToggleSidebar: () => void
  onToggleSettings: () => void
}

export function EditorHeader({ onToggleSidebar }: EditorHeaderProps) {
  const { state, actions } = useEditor()

  const handleUndo = () => {
    actions.undo()
  }

  const handleRedo = () => {
    actions.redo()
  }

  const handleExportPNG = async () => {
    try {
      const dataUrl = await exportToPNG("editor-canvas")
      const link = document.createElement("a")
      link.download = "canvas-design.png"
      link.href = dataUrl
      link.click()
    } catch (error) {
      console.error("Failed to export PNG:", error)
    }
  }
  const handleDeleteSelected = () => {
    state.selectedLayerIds.forEach((id) => {
      actions.deleteLayer(id)
    })
    actions.saveToHistory()
  }

  const hasSelectedLayers = state.selectedLayerIds.length > 0
  return (
    <TooltipProvider delayDuration={300}>
      <header className="border-b border-border p-2 flex items-center justify-between bg-background">
        <div className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={onToggleSidebar}>
                <PanelLeft className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Toggle Sidebar</TooltipContent>
          </Tooltip>
          <h1 className="text-lg font-semibold">Editor</h1>
        </div>

        <div className="flex items-center gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={handleUndo} disabled={state.history.past.length === 0}>
                <Undo className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Undo (Ctrl+Z)</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={handleRedo} disabled={state.history.future.length === 0}>
                <Redo className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Redo (Ctrl+Y)</TooltipContent>
          </Tooltip>

          {hasSelectedLayers && (
            <>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={handleDeleteSelected}>
                    <Trash2 className="h-5 w-5 text-destructive" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Delete (Del)</TooltipContent>
              </Tooltip>
            </>
          )}
          <DropdownMenu>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Download className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
              </TooltipTrigger>
              <TooltipContent>Export</TooltipContent>
            </Tooltip>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={handleExportPNG}>Export as PNG</DropdownMenuItem>
              <DropdownMenuItem onClick={() => saveDesignAsFile(state)}>Export as JSON</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Separator orientation="vertical" className="mx-1 h-6" />

          <ModeToggle />
        </div>
      </header>
    </TooltipProvider>
  )
}
