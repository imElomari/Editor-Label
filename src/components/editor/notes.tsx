"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Save, X } from "lucide-react"
import { useEditor } from "./editor-context"

export function Notes() {
  const { state, actions } = useEditor()
  const [notes, setNotes] = useState(state.notes)
  const [saved, setSaved] = useState(true)

  useEffect(() => {
    setNotes(state.notes)
    setSaved(true)
  }, [state.notes])

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNotes(e.target.value)
    setSaved(false)
  }

  const handleSave = () => {
    actions.setNotes(notes)
    actions.saveToHistory()
    setSaved(true)
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h2 className="text-lg font-semibold">Notes</h2>
        <div className="flex items-center gap-2">
          {!saved && (
            <Button size="sm" onClick={handleSave}>
              <Save className="h-4 w-4 mr-1" />
              Save
            </Button>
          )}
          <Button 
            size="icon" 
            variant="ghost" 
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="flex-1 p-4">
        <Textarea
          placeholder="Add notes about your design..."
          value={notes}
          onChange={handleChange}
          className="min-h-[200px] h-full resize-none"
        />
      </div>
      
      {!saved && (
        <div className="px-4 py-2 border-t border-border">
          <p className="text-xs text-muted-foreground">
            You have unsaved changes
          </p>
        </div>
      )}
    </div>
  )
}