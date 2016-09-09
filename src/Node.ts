/// <reference path="./Object3d" />

module CanvasToy {

    /*
     * @author Danielhu229 http://hustdanielhu.com
     */
    export class Node extends Object3d {

        public children: Array<Node>;

        protected parent: Node = null;

        constructor() {
            super();
            this.parent = null;
            this.children = [];
            this.registerUpdate(() => {
                this.apply();
            })
        }

        public addChild(child: Node) {
            this.children.push(child);
            child.parent = this;
        }

        public apply() {
            var current: Node = this;
            this.matrix = mat4.copy(mat4.create(), this.localMatrix)
            while (current != null) {
                // FIXME: bones matrix calculate, should use totalRotationMatrix * totalTranslationMatrix
                this.matrix = mat4.mul(mat4.create(), current.localMatrix, this.matrix);
                current = current.parent;
            }
        }

        public compuseMatrixs() {

        }
    }
}
