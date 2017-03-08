/// <reference path="../CanvasToy.ts"/>
/// <reference path="../shader/Program.ts"/>

namespace CanvasToy {

    export class Faces {
        public buffer: WebGLBuffer;
        public data: number[] = [];
        constructor(gl: WebGLRenderingContext, data: number[]) {
            this.data = data;
            this.buffer = gl.createBuffer();
        }
    }

    export class Geometry {

        public attributes: {
            position: Attribute,
            uv: Attribute,
            normal: Attribute,
            flatNormal: Attribute,
        };

        public faces: Faces;

        constructor(gl: WebGLRenderingContext) {
            this.attributes = {
                position: new Attribute(gl, { type: DataType.float, size: 3, data: [] }),
                uv: new Attribute(gl, { type: DataType.float, size: 2, data: [] }),
                normal: new Attribute(gl, { type: DataType.float, size: 3, data: [] }),
                flatNormal: new Attribute(gl, { type: DataType.float, size: 3, data: [] }),
            };
            this.faces = { data: [], buffer: gl.createBuffer() };
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
                    if (vertex[attributeName].length !== this.attributes[attributeName].size) {
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
                        this.attributes[attributeName].data[this.attributes[attributeName].stride * index + i],
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
                const flatX = (triangle[0].normals[0] + triangle[0].normals[1] + triangle[0].normals[2]) / 3;
                const flatY = (triangle[1].normals[0] + triangle[1].normals[1] + triangle[1].normals[2]) / 3;
                const flatZ = (triangle[2].normals[0] + triangle[0].normals[1] + triangle[2].normals[2]) / 3;

                const flat = [
                    flatX, flatY, flatZ,
                    flatX, flatY, flatZ,
                    flatX, flatY, flatZ,
                ];
                this.attributes.flatNormal.data = this.attributes.flatNormal.data.concat(flat);
            }
            return this;
        }
    }
}
