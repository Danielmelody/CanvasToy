import { DataType } from "../DataTypeEnum";

export class Attribute {
    public name?: string;
    public size: number = 3;
    public data: number[] = [];
    public type: number;
    public index: number = 0;
    public stride: number = 0;
    public buffer: WebGLBuffer = null;
    public gl: WebGLRenderingContext = null;
    constructor(
        gl: WebGLRenderingContext,
        paramter: { type: number, size?: number, data?: number[], stride?: number },
    ) {
        this.buffer = gl.createBuffer();
        this.gl = gl;
        for (const attributeInfo in paramter) {
            this[attributeInfo] = paramter[attributeInfo] ? paramter[attributeInfo] : this[attributeInfo];
        }
        switch (paramter.type) {
            case DataType.float: this.type = gl.FLOAT; break;
            case DataType.int: this.type = gl.INT; break;
            default: break;
        }
    }
}
