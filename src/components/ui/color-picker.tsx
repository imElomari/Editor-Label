"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

interface ColorPickerProps {
  color: string
  onChange: (color: string) => void
}

export function ColorPicker({ color, onChange }: ColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [inputValue, setInputValue] = useState(color)
  const [activeTab, setActiveTab] = useState("solid")

  // Update input value when color changes externally
  useEffect(() => {
    setInputValue(color)
  }, [color])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
  }

  const handleInputBlur = () => {
    if (isValidHex(inputValue)) {
      onChange(inputValue)
    } else {
      setInputValue(color)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && isValidHex(inputValue)) {
      onChange(inputValue)
      setIsOpen(false)
    }
  }

  const isValidHex = (hex: string) => {
    return /^#([0-9A-F]{3}){1,2}$/i.test(hex)
  }

  const colorPresets = [
    "#000000",
    "#FFFFFF",
    "#F44336",
    "#E91E63",
    "#9C27B0",
    "#673AB7",
    "#3F51B5",
    "#2196F3",
    "#03A9F4",
    "#00BCD4",
    "#009688",
    "#4CAF50",
    "#8BC34A",
    "#CDDC39",
    "#FFEB3B",
    "#FFC107",
    "#FF9800",
    "#FF5722",
    "#795548",
    "#607D8B",
  ]

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-8 h-8 p-0 border-2" style={{ backgroundColor: color }} />
      </PopoverTrigger>
      <PopoverContent className="w-64 p-3" align="end">
        <Tabs defaultValue="solid" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full mb-4">
            <TabsTrigger value="solid" className="flex-1">
              Solid
            </TabsTrigger>
            <TabsTrigger value="gradient" className="flex-1">
              Gradient
            </TabsTrigger>
          </TabsList>
          <TabsContent value="solid" className="space-y-4">
            <div className="grid grid-cols-5 gap-2">
              {colorPresets.map((presetColor) => (
                <Button
                  key={presetColor}
                  variant="outline"
                  className={cn("w-8 h-8 p-0 border-2", color === presetColor && "ring-2 ring-primary")}
                  style={{ backgroundColor: presetColor }}
                  onClick={() => onChange(presetColor)}
                />
              ))}
            </div>
            <div className="flex gap-2">
              <div className="w-9 h-9 rounded-md border-2" style={{ backgroundColor: inputValue }} />
              <div className="flex-1 flex gap-2">
                <Input
                  value={inputValue}
                  onChange={handleInputChange}
                  onBlur={handleInputBlur}
                  onKeyDown={handleKeyDown}
                />
              </div>
            </div>
          </TabsContent>
          <TabsContent value="gradient" className="flex flex-col space-y-4">
            <p className="text-sm text-muted-foreground">Gradient features coming soon!</p>
          </TabsContent>
        </Tabs>
      </PopoverContent>
    </Popover>
  )
}
