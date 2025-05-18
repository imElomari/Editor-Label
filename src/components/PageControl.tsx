"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

import { Check, FileText } from "lucide-react"
import { useEditor } from "@/hooks/useEditor"
export function PageControl() {
  const [openScaleOptions, setOpenScaleOptions] = useState(false)
  const { state, actions } = useEditor()
  const { scale, sideBarTab } = state

  const handleChangeScale = (value: number[]) => {
    actions.setScale(value[0] / 100)
  }

  const scaleOptions = [400, 300, 200, 150, 100, 75, 50, 25]

  return (
    <div className="flex items-center justify-between px-4 border-b h-12 w-full">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          className={cn("gap-2", state.sideBarTab === "notes" && "bg-accent")}
          onClick={() => actions.setSidebarTab(sideBarTab === "notes" ? null : "notes")}
        >
          <FileText className="h-4 w-4" />
          <span>Notes</span>
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <div className="w-[200px]">
          <Slider defaultValue={[scale * 100]} min={10} max={400} step={1} onValueChange={handleChangeScale} />
        </div>

        <Popover open={openScaleOptions} onOpenChange={setOpenScaleOptions}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="w-[80px]">
              {Math.round(scale * 100)}%
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[120px] p-0">
            <div className="flex flex-col">
              {scaleOptions.map((value) => (
                <Button
                  key={value}
                  variant="ghost"
                  className="justify-between h-9"
                  onClick={() => {
                    actions.setScale(value / 100)
                    setOpenScaleOptions(false)
                  }}
                >
                  {value}%{value === Math.round(scale * 100) && <Check className="h-4 w-4" />}
                </Button>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  )
}
