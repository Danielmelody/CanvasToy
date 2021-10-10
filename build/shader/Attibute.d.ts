export declare class Attribute {
    name?: string;
    size: number;
    data: number[];
    type: number;
    index: number;
    stride: number;
    buffer: WebGLBuffer;
    gl: WebGLRenderingContext;
    constructor(gl: WebGLRenderingContext, paramter: {
        type: number;
        size?: number;
        data?: number[];
        stride?: number;
    });
}
