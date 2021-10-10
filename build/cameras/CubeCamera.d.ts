import { PerspectiveCamera } from "./PerspectiveCamera";
export declare class CubeCamera extends PerspectiveCamera {
    private _projectionMatrices;
    constructor();
    compuseProjectionMatrix(): void;
    deCompuseProjectionMatrix(): void;
}
