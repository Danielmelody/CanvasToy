/// <reference path="./Object3d" />

module CanvasToy{

    /*
     * @author Danielhu229 http://hustdanielhu.com
     */
    export class Node extends Object3d{

        protected parent:Node;

        protected children:Array<Node>;

        protected relativeMatrix:Mat4Array;

        protected mvUniform:WebGLUniformLocation;
        protected pMUniform:WebGLUniformLocation;


        constructor(){
            super();
            this.parent = null;
            this.children = [];
            this.relativeMatrix = mat4.create();
        }

        public addChild(child:Node){
            this.children.push(child);
            child.parent = this;
        }

        public compuseMatrixs(){
            var parentMatrix = this.parent.matrix;
            this.modelViewMatrix = mat4.mul(mat4.create(), this.relativeMatrix, parentMatrix);
            for(let child of this.children){
                child.compuseMatrixs();
            }
        }
    }
}
