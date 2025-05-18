import { useContext } from 'react'
import { EditorContext } from '@/components/editor/editor-context'

export function useEditor() {
  const context = useContext(EditorContext)
  
  if (!context) {
    throw new Error('useEditor must be used within an EditorProvider')
  }

  const { state, actions } = context

  return {
    state,
    actions,
  }
}