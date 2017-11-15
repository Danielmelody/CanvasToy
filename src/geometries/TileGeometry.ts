
import { Geometry } from "./Geometry";

export class TileGeometry extends Geometry {
    private _widthSegments: number = 8;
    private _heightSegments: number = 6;
    private _width: number = 2;
    private _height: number = 2;
    constructor(gl: WebGLRenderingContext) {
        super(gl);
    }

    public build() {
        let index = 0;
        const grid = [];
        for (let x = 0; x <= this._widthSegments; ++x) {
            const row = [];
            for (let y = 0; y <= this._heightSegments; ++y) {
                const position = [
                    this._width * (x - this._widthSegments / 2) / this._widthSegments,
                    this._height * (y - this._heightSegments / 2) / this._heightSegments,
                    0,
                ];
                const aMainUV = [x / this._widthSegments, y / this._heightSegments];
                const aNormal = [0, 0, 1];
                this.addVertex({ position, aNormal, aMainUV });
                row.push(index++);
            }
            grid.push(row);
        }
        for (let x = 0; x < this._widthSegments; ++x) {
            for (let y = 0; y < this._heightSegments; ++y) {
                const a = grid[x][y];
                const b = grid[x + 1][y];
                const c = grid[x + 1][y + 1];
                const d = grid[x][y + 1];
                this.faces.data.push(a, b, c);
                this.faces.data.push(a, d, c);
            }
        }
        return this;
    }
}
