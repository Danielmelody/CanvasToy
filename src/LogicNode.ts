/// <reference path="./Object3d" />

module CanvasToy{

    /*
     * @author Danielhu229 http://hustdanielhu.com
     */
    export class LogicNode extends Object3d implements Drawable{

        protected parent:LogicNode;

        protected children:Array<LogicNode>;

        protected relativeMatrix:Mat4Array;

        constructor(){
            super();
            this.parent = null;
            this.children = [];
            this.relativeMatrix = mat4.create();
        }

        public addChild(child:LogicNode){
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

        public draw(gl, camera:Camera){
            this.matrix = mat4.mul(mat4.create(), camera.modelViewMatrix, this.modelViewMatrix);
            this.matrix = mat4.mul(mat4.create(), camera.projectionMatrix, this.modelViewMatrix);
        }
    }
}
