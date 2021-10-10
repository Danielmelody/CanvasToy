import { IDirtyable } from "../Dirtyable";
import { Attribute } from "../shader/Attibute";
export declare class Faces {
    buffer: WebGLBuffer | null;
    data: number[];
    constructor(gl: WebGLRenderingContext, data: number[]);
}
export declare class Geometry implements IDirtyable {
    attributes: {
        [index: string]: Attribute;
    };
    faces: Faces;
    protected _dirty: boolean;
    protected gl: WebGLRenderingContext;
    constructor(gl: WebGLRenderingContext);
    build(): this;
    assertValid(): this;
    setAttribute(name: any, attribute: Attribute): this;
    addVertex(vertex: any): this;
    removeAttribute(name: string): this;
    getVertexByIndex(index: number): any;
    getTriangleByIndex(triangleIndex: number): any[];
    generateFlatNormal(): this;
    resetLightShadows(gl: WebGLRenderingContext): void;
}
