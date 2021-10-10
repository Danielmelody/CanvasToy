import { Geometry } from "./Geometry";
export declare class SphereGeometry extends Geometry {
    private _radius;
    private _widthSegments;
    private _heightSegments;
    private _phiStart;
    private _phiLength;
    private _thetaStart;
    private _thetaLength;
    constructor(gl: WebGLRenderingContext);
    build(): this;
    get radius(): number;
    get widthSegments(): number;
    get heightSegments(): number;
    get phiStart(): number;
    get phiLength(): number;
    get thetaStart(): number;
    get thetaLength(): number;
    setRadius(radius: number): this;
    setWidthSegments(widthSegments: number): this;
    setHeightSegments(heightSegments: number): this;
    setPhiStart(phiStart: number): this;
    setPhiLength(phiLength: number): this;
    setThetaStart(thetaStart: number): this;
    setThetaLength(thetaLength: number): this;
}
