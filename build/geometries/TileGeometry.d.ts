import { Geometry } from "./Geometry";
export declare class TileGeometry extends Geometry {
    private _widthSegments;
    private _heightSegments;
    private _width;
    private _height;
    constructor(gl: WebGLRenderingContext);
    build(): this;
}
