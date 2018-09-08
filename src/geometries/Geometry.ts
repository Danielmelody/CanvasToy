import { DataType } from "../DataTypeEnum";
import { IDirtyable } from "../Dirtyable";
import { Graphics } from "../renderer/GraphicsUtils";
import { Attribute } from "../shader/Attibute";

export class Faces {
    public buffer: WebGLBuffer | null;
    public data: number[] = [];
    constructor(gl: WebGLRenderingContext, data: number[]) {
        this.data = data;
        this.buffer = gl.createBuffer();
    }
}

export class Geometry implements IDirtyable {
    public attributes: {
        [index: string]: Attribute;
    };

    public faces: Faces;

    protected _dirty = true;

    protected gl: WebGLRenderingContext;

    constructor(gl: WebGLRenderingContext) {
        this.gl = gl;
        this.attributes = {
            position: new Attribute(gl, {
                type: DataType.float,
                size: 3,
                data: [],
            }),
            aMainUV: new Attribute(gl, {
                type: DataType.float,
                size: 2,
                data: [],
            }),
            aNormal: new Attribute(gl, {
                type: DataType.float,
                size: 3,
                data: [],
            }),
            flatNormal: new Attribute(gl, {
                type: DataType.float,
                size: 3,
                data: [],
            }),
        };
        this.faces = { data: [], buffer: gl.createBuffer() };
    }

    public build() {
        // empty here
        return this;
    }

    public assertValid() {
        let maxIndex = 0;
        for (const index of this.faces.data) {
            maxIndex = Math.max(maxIndex, index);
        }
        for (const attributeName in this.attributes) {
            console.assert(
                this.attributes[attributeName].size <= 4 &&
                    this.attributes[attributeName].size >= 1,
                attributeName +
                    "size error, now: " +
                    this.attributes[attributeName].size +
                    " should be 1-4",
            );
            console.assert(
                (maxIndex + 1) * this.attributes[attributeName].stride <=
                    this.attributes[attributeName].data.length,
                attributeName +
                    " length error, now:" +
                    this.attributes[attributeName].data.length +
                    ", should bigger than:" +
                    (maxIndex + 1) * this.attributes[attributeName].stride,
            );
        }
        return this;
    }

    public setAttribute(name, attribute: Attribute) {
        this.attributes[name] = attribute;
        return this;
    }

    public addVertex(vertex: any) {
        for (const attributeName in this.attributes) {
            if (this.attributes[attributeName] !== undefined) {
                if (vertex[attributeName] === undefined) {
                    continue;
                }
                if (
                    vertex[attributeName].length !==
                    this.attributes[attributeName].size
                ) {
                    console.error("length " + attributeName + "wrong");
                    continue;
                }
                for (const comp of vertex[attributeName]) {
                    this.attributes[attributeName].data.push(comp);
                }
            }
        }
        return this;
    }

    public removeAttribute(name: string) {
        this.attributes[name] = undefined;
        return this;
    }

    public getVertexByIndex(index: number) {
        const vertex: any = {};
        for (const attributeName in this.attributes) {
            vertex[attributeName] = [];
            for (let i = 0; i < this.attributes[attributeName].stride; ++i) {
                vertex[attributeName].push(
                    this.attributes[attributeName].data[
                        this.attributes[attributeName].stride * index + i
                    ],
                );
            }
        }
        return vertex;
    }

    public getTriangleByIndex(triangleIndex: number) {
        return [
            this.getVertexByIndex(triangleIndex * 3),
            this.getVertexByIndex(triangleIndex * 3 + 1),
            this.getVertexByIndex(triangleIndex * 3 + 2),
        ];
    }

    public generateFlatNormal() {
        for (let i = 0; i < this.faces.data.length; i += 3) {
            const triangle = this.getTriangleByIndex(i / 3);
            const flatX =
                (triangle[0].normals[0] +
                    triangle[0].normals[1] +
                    triangle[0].normals[2]) /
                3;
            const flatY =
                (triangle[1].normals[0] +
                    triangle[1].normals[1] +
                    triangle[1].normals[2]) /
                3;
            const flatZ =
                (triangle[2].normals[0] +
                    triangle[0].normals[1] +
                    triangle[2].normals[2]) /
                3;

            const flat = [
                flatX,
                flatY,
                flatZ,
                flatX,
                flatY,
                flatZ,
                flatX,
                flatY,
                flatZ,
            ];
            this.attributes.flatNormal.data = this.attributes.flatNormal.data.concat(
                flat,
            );
        }
        return this;
    }

    public resetLightShadows(gl: WebGLRenderingContext) {
        if (this._dirty) {
            Graphics.copyDataToVertexBuffer(gl, this);
        }
        this._dirty = false;
    }
}
