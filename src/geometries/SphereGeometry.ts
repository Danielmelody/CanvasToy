import { vec3 } from "gl-matrix";

import { Geometry } from "./Geometry";

export class SphereGeometry extends Geometry {
    private _radius: number = 1;
    private _widthSegments: number = 8;
    private _heightSegments: number = 6;
    private _phiStart: number = 0;
    private _phiLength: number = Math.PI * 2;
    private _thetaStart: number = 0;
    private _thetaLength: number = Math.PI;

    constructor(gl: WebGLRenderingContext) {
        super(gl);
    }

    public build() {

        // thanks to the algorithm by there.js
        let iy = 0;
        let ix = 0;
        let index = 0;
        const grid = [];
        const thetaEnd = this._thetaStart + this._thetaLength;
        for (iy = 0; iy <= this._heightSegments; iy++) {
            const verticesRow = [];
            const v = iy / this._heightSegments;
            for (ix = 0; ix <= this._widthSegments; ix++) {
                const aMainUV = [ix / this._widthSegments, 1 - iy / this._heightSegments];
                const position = Float32Array.from([
                    - this._radius * Math.cos(this._phiStart + aMainUV[0] * this._phiLength)
                    * Math.sin(this._thetaStart + v * this._thetaLength),
                    this._radius * Math.cos(this._thetaStart + aMainUV[1] * this._thetaLength),
                    this._radius * Math.sin(this._phiStart + aMainUV[0] * this._phiLength)
                    * Math.sin(this._thetaStart + v * this._thetaLength),
                ]);
                const aNormal = vec3.normalize(vec3.create(), position);
                this.addVertex({ position, aNormal, aMainUV });
                verticesRow.push(index++);
            }
            grid.push(verticesRow);
        }
        for (iy = 0; iy < this._heightSegments; iy++) {
            for (ix = 0; ix < this._widthSegments; ix++) {
                const a = grid[iy][ix + 1];
                const b = grid[iy][ix];
                const c = grid[iy + 1][ix];
                const d = grid[iy + 1][ix + 1];
                if (iy !== 0 || this._thetaStart > 0) {
                    this.faces.data.push(a, b, d);
                }
                if (iy !== this._heightSegments - 1 || thetaEnd < Math.PI) {
                    this.faces.data.push(b, c, d);
                }
            }
        }
        return this;
    }

    public get radius(): number { return this._radius; }
    public get widthSegments(): number { return this._widthSegments; }
    public get heightSegments(): number { return this._heightSegments; }
    public get phiStart(): number { return this._phiStart; }
    public get phiLength(): number { return this._phiLength; }
    public get thetaStart(): number { return this._thetaStart; }
    public get thetaLength(): number { return this._thetaLength; }

    public setRadius(radius: number) {
        this._radius = radius;
        return this;
    }
    public setWidthSegments(widthSegments: number) {
        this._widthSegments = widthSegments;
        return this;
    }
    public setHeightSegments(heightSegments: number) {
        this._heightSegments = heightSegments;
        return this;
    }
    public setPhiStart(phiStart: number) {
        this._phiStart = phiStart;
        return this;
    }
    public setPhiLength(phiLength: number) {
        this._phiLength = phiLength;
        return this;
    }
    public setThetaStart(thetaStart: number) {
        this._thetaStart = thetaStart;
        return this;
    }
    public setThetaLength(thetaLength: number) {
        this._thetaLength = thetaLength;
        return this;
    }
}
