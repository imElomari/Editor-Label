import { LayerComponentProps, Delta, BoxSize } from "@/types";
import { FC } from "react";
import { getTransformStyle } from "../../../utils/getTransformStyle";

export interface ImageContentProps extends LayerComponentProps {
  url: string;
  thumb?: string;
  position: Delta;
  rotate: number;
  boxSize: BoxSize;
  transparency?: number;
}
export const ImageContent: FC<ImageContentProps> = ({
  boxSize,
  position,
  rotate,
  url,
}) => {
  return (
    <div
      style={{
        overflow: "hidden",
        pointerEvents: "auto",
        width: boxSize.width,
        height: boxSize.height,
      }}
    >
      <div
        style={{
          width: boxSize.width,
          height: boxSize.height,
          transform: getTransformStyle({ position: position, rotate: rotate }),
          position: "relative",
          userSelect: "none",
        }}
      >
        <img
          src={url}
          style={{
            objectFit: "fill",
            width: "100%",
            height: "100%",
            position: "absolute",
            pointerEvents: "none",
          }}
        />
      </div>
    </div>
  );
};
