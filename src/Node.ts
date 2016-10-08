/// <reference path="./Object3d.ts" />

module CanvasToy {

    /*
     * @author Danielhu229 http://hustdanielhu.com
     */

    export class Node extends Object3d {

        public children: Array<Node>;

        public parent: Node = null;

        constructor() {
            super();
            this.parent = null;
            this.children = [];
            this.registUpdate(() => {
                this.apply();
            })
        }

        public addChild(child: Node) {
            this.children.push(child);
            child.parent = this;
        }

        public apply() {
            var current: Node = this;
            this.matrix = mat4.copy(mat4.create(), this.localMatrix);
            let positionMatrix = mat4.clone(this.position);
            let rotation = quat.clone(this.rotation);
            while (current.parent != null) {
                positionMatrix = mat4.mul(mat4.create(), this.parent.position, positionMatrix);
                rotation = quat.mul(quat.create(), this.parent.rotation, rotation);
            }
            let rotationMatrix = mat4.fromQuat(mat4.create(), rotation);
            mat4.mul(this.matrix, rotationMatrix, positionMatrix);
        }

        public compuseMatrixs() {

        }
    }
}
