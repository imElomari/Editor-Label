"use client";

import { Button } from "@/components/ui/button";
import { PanelLeft, Undo, Redo, Download, Trash2 } from "lucide-react";
import { useEditor } from "./editor-context";
import { exportToPNG } from "@/utils/exportToPNG";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import { saveDesignAsFile } from "@/utils/exportDesign";
import { ModeToggle } from "../mode-toggle";
import { useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

interface EditorHeaderProps {
  onToggleSidebar: () => void;
}

export function EditorHeader({ onToggleSidebar }: EditorHeaderProps) {
  const { state, actions } = useEditor();
  const [isEditingName, setIsEditingName] = useState(false);
  const [projectName, setProjectName] = useState(
    state.page.name || "Untitled Design"
  );
  const inputRef = useRef<HTMLInputElement>(null);

  const handleNameChange = (newName: string) => {
    setProjectName(newName);
    actions.saveToHistory();
  };

  const finishEditing = () => {
    setIsEditingName(false);
    handleNameChange(projectName);
  };
  const handleUndo = () => {
    actions.undo();
  };

  const handleRedo = () => {
    actions.redo();
  };

  const handleExportPNG = async () => {
    try {
      const dataUrl = await exportToPNG("editor-canvas");
      const link = document.createElement("a");
      link.download = "canvas-design.png";
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error("Failed to export PNG:", error);
    }
  };
  const handleDeleteSelected = () => {
    state.selectedLayerIds.forEach((id) => {
      actions.deleteLayer(id);
    });
    actions.saveToHistory();
  };

  const startEditing = () => {
    setIsEditingName(true);
    setTimeout(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    }, 0);
  };

  const hasSelectedLayers = state.selectedLayerIds.length > 0;
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

          <div className="flex items-center">
            {isEditingName ? (
              <Input
                ref={inputRef}
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                onBlur={finishEditing}
                onKeyDown={(e) => e.key === "Enter" && finishEditing()}
                className="h-8 w-[180px]"
              />
            ) : (
              <h1
                className="text-lg font-semibold cursor-pointer hover:bg-accent hover:text-accent-foreground px-3 py-1 rounded-md transition-colors"
                onClick={startEditing}
              >
                {projectName}
              </h1>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1">
          {/* History Controls */}
          <div className="flex items-center bg-muted/40 rounded-md p-0.5 mr-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleUndo}
                  disabled={state.history.past.length === 0}
                  className="h-8 w-8"
                >
                  <Undo className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Undo (Ctrl+Z)</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleRedo}
                  disabled={state.history.future.length === 0}
                  className="h-8 w-8"
                >
                  <Redo className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Redo (Ctrl+Y)</TooltipContent>
            </Tooltip>
          </div>

          {/* Delete Button */}
          {hasSelectedLayers && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleDeleteSelected}
                  className={cn(
                    "text-destructive h-9 w-9",
                    "hover:bg-destructive/10 hover:text-destructive"
                  )}
                >
                  <Trash2 className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Delete (Del)</TooltipContent>
            </Tooltip>
          )}

          {/* Export Menu */}
          <DropdownMenu>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-1">
                    <Download className="h-4 w-4" />
                    <span>Export</span>
                  </Button>
                </DropdownMenuTrigger>
              </TooltipTrigger>
              <TooltipContent>Export Options</TooltipContent>
            </Tooltip>
            <DropdownMenuContent align="end" className="min-w-[200px]">
              <DropdownMenuItem
                onClick={handleExportPNG}
                className="flex items-center gap-2"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    x="2"
                    y="2"
                    width="20"
                    height="20"
                    rx="2"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <circle cx="8" cy="8" r="2" fill="currentColor" />
                  <path
                    d="M22 16L18 12L14 16L10 12L2 20"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                </svg>
                Export as PNG
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => saveDesignAsFile(state)}
                className="flex items-center gap-2"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M14 2V8H20"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M12 18V12"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M8 15L12 19L16 15"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Export as JSON
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="flex items-center gap-2">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M21 7V17C21 18.1046 20.1046 19 19 19H5C3.89543 19 3 18.1046 3 17V7M21 7C21 5.89543 20.1046 5 19 5H5C3.89543 5 3 5.89543 3 7M21 7V8H3V7"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <path
                    d="M12 12L16 15H8L12 12Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Export 3D Preview
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Separator orientation="vertical" className="mx-2 h-6" />

          <ModeToggle />
        </div>
      </header>
    </TooltipProvider>
  );
}
