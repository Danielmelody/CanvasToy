import { Camera } from "./Camera";
export declare class PerspectiveCamera extends Camera {
    protected _aspect: number;
    protected _fovy: number;
    constructor(parameter?: {
        aspect?: number;
        fovy?: number;
        near?: number;
        far?: number;
    });
    compuseProjectionMatrix(): void;
    get aspect(): number;
    get fovy(): number;
    setAspect(aspect: number): this;
    setFovy(fovy: number): this;
    deCompuseProjectionMatrix(): void;
    setAspectRadio(ratio: number): this;
    changeZoom(offset: number): this;
}
