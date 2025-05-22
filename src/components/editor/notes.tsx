"use client"

import { useState, useEffect } from "react"
import { Textarea } from "@/components/ui/textarea"
import { useEditor } from "./editor-context"

export function Notes() {
  const { state, actions } = useEditor()
  const [notes, setNotes] = useState(state.page.notes || ""); // Persist notes in state

  useEffect(() => {
    setNotes(state.page.notes || "")
  }, [state.page.notes])

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const updatedNotes = e.target.value
    setNotes(updatedNotes)
    actions.updatePageState({ notes: updatedNotes }); // Persist notes in the editor state
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h2 className="text-lg font-semibold">Notes</h2>
      </div>

      <div className="flex-1 p-4">
        <Textarea
          placeholder="Add notes about your design..."
          value={notes}
          onChange={handleChange}
          className="min-h-[200px] h-full resize-none"
        />
      </div>
    </div>
  )
}