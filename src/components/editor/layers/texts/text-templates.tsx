import { useEditor } from "@/hooks";
import { Button } from "@/components/ui/button";
import texts from "@/api/json/texts.json";
import { TextLayer } from "@/types/layer";

export function TextTemplates() {
  const { actions } = useEditor();

  const createTextLayer = (template: any) => {
    try {
      const templateData = JSON.parse(template.data);
      const textLayers = Object.values(templateData.layers).filter(
        (layer: any) => layer.type?.resolvedName === "TextLayer"
      );

      textLayers.forEach((textLayer: any) => {
        const props = textLayer.props;
        const styleStr = props.text.match(/style="([^"]*)"/)?.[1] || "";
        const styles = Object.fromEntries(
          styleStr
            .split(";")
            .map((style: string) => style.split(":").map((s: string) => s.trim()))
            .filter(([k]: [string, string]) => k)
        );

        const newLayer: TextLayer = {
          id: `text-${Date.now()}-${Math.random()}`,
          type: "text",
          text: props.text.replace(/<[^>]+>/g, ""),
          fontFamily: styles["font-family"]?.replace(/['"]/g, "") || "Inter",
          fontSize: parseInt(styles["font-size"]) || 16,
          color: props.colors?.[0] || styles.color || "#000000",
          textAlign: styles["text-align"] || "left",
          boxData: {
            position: { x: 100, y: 100 },
            boxSize: { width: 300, height: 100 },
            rotate: props.rotate || 0,
          },
          opacity: 1,
          zIndex: Date.now(),
        };
        actions.addLayer(newLayer);
      });
      actions.saveToHistory();
    } catch (error) {
      console.error("Error creating text layer:", error);
    }
  };

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-sm font-medium">Text Templates</h2>
      <div className="grid gap-2">
        {texts.data.map((template, index) => (
          <Button
            key={index}
            variant="outline"
            className="w-full h-auto p-4 flex flex-col items-center gap-2 group hover:bg-accent"
            onClick={() => createTextLayer(template)}
          >
            <div
              className="w-full text-center"
              dangerouslySetInnerHTML={{
                __html:
                  template.data.match(/text":"([^"]*)/)?.[1] || template.desc,
              }}
              style={{
                fontSize: "14px",
                lineHeight: "1.2",
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
              }}
            />
          </Button>
        ))}
      </div>
    </div>
  );
}
