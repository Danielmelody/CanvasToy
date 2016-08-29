/// <reference path="../CanvasToy.ts"/>

module CanvasToy {

    export class Geometry {

        public positions: number[] = [];
        public uvs: number[] = [];
        public normals: number[] = [];
        public faces: number[] = [];
        public flatNormals: number[] = [];

        constructor(size?: number) {

        }

        public generateFlatNormal() {
            for (let i = 0; i < this.faces.length; i += 3) {
                let flatX = (this.normals[this.faces[i] * 3] + this.normals[this.faces[i + 1] * 3] + this.normals[this.faces[i + 2] * 3]) / 3;
                let flatY = (this.normals[this.faces[i] * 3 + 1] + this.normals[this.faces[i + 1] * 3 + 1] + this.normals[this.faces[i + 2] * 3 + 1]) / 3;
                let flatZ = (this.normals[this.faces[i] * 3 + 2] + this.normals[this.faces[i + 1] * 3 + 2] + this.normals[this.faces[i + 2] * 3 + 2]) / 3;

                var flat = [
                    flatX, flatY, flatZ,
                    flatX, flatY, flatZ,
                    flatX, flatY, flatZ
                ];

                this.flatNormals = this.flatNormals.concat(flat);
            }
            console.log(this.flatNormals);
        }

        addVertex(index: Vec3Array, position: Vec3Array, uv: Vec2Array, normal: Vec3Array) {
            this.faces.push.apply(index);
            this.positions.push.apply(position);
            (!!uv) ? this.uvs.push.apply(uv) : 0;
            (!!normal) ? this.normals.push.apply : 0;
        }
    }
}
