import { Delta } from "@/types";

export const applyToPoint = (matrix: WebKitCSSMatrix, point: Delta) => ({
    x: matrix.a * point.x + matrix.c * point.y,
    y: matrix.b * point.x + matrix.d * point.y,
});
