import { Toggle } from "@/components/ui/toggle";
import { Bold, Italic, Underline } from "lucide-react";
import { useEditor } from "@/hooks";
import { fontFamilies } from "@/styles/fonts";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

export function TextStyleControls() {
  const { state, actions } = useEditor();
  const selectedLayer = state.selectedLayerIds[0]
    ? state.page.layers[state.selectedLayerIds[0]]
    : null;

  if (!selectedLayer || selectedLayer.type !== "text") return null;

  const styles = selectedLayer.styles || {};

  const toggleStyle = (style: "bold" | "italic" | "underline") => {
    if (selectedLayer?.type === "text") {
      const currentStyles = selectedLayer.styles || {};
      const newStyles = {
        ...currentStyles,
        [style]: !currentStyles[style],
      };

      actions.updateLayer(selectedLayer.id, {
        styles: newStyles
      });
      actions.saveToHistory();
    }
  };

  const updateFont = (fontFamily: string) => {
    if (selectedLayer?.type === "text") {
      actions.updateLayer(selectedLayer.id, {
        fontFamily
      });
      actions.saveToHistory();
    }
  };


  return (
    <div className="flex items-center gap-2">
      <Toggle
        pressed={styles.bold}
        onPressedChange={() => toggleStyle("bold")}
        size="sm"
      >
        <Bold className="h-4 w-4" />
      </Toggle>
      <Toggle
        pressed={styles.italic}
        onPressedChange={() => toggleStyle("italic")}
        size="sm"
      >
        <Italic className="h-4 w-4" />
      </Toggle>
      <Toggle
        pressed={styles.underline}
        onPressedChange={() => toggleStyle("underline")}
        size="sm"
      >
        <Underline className="h-4 w-4" />
      </Toggle>
      <Select
        value={selectedLayer.fontFamily || "Inter"}
        onValueChange={(value) => updateFont(value)}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select font" />
        </SelectTrigger>
        <SelectContent>
          {fontFamilies.map((font) => (
            <SelectItem key={font.value} value={font.value}>
              <span style={{ fontFamily: font.value }}>{font.name}</span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
