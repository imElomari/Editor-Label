import { Editor } from "./components/editor/editor"
import { EditorProvider } from "./components/editor/editor-context"

function App() {
  return (
    <EditorProvider>
      <div className="flex h-screen">
        <Editor />
      </div>
    </EditorProvider>
  )
}

export default App