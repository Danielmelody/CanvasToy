import { Camera } from "./Camera";
export declare class OrthoCamera extends Camera {
    protected _left: number;
    protected _right: number;
    protected _bottom: number;
    protected _top: number;
    protected _baseSize: number;
    protected _ratio: number;
    constructor(parameters?: {
        left?: number;
        right?: number;
        bottom?: number;
        top?: number;
        near?: number;
        far?: number;
    });
    setLeft(left: number): void;
    get left(): number;
    get right(): number;
    get top(): number;
    get bottom(): number;
    compuseProjectionMatrix(): void;
    deCompuseProjectionMatrix(): void;
    setAspectRadio(radio: number): this;
    changeZoom(offset: number): this;
}
