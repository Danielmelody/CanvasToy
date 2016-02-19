/// <reference path="./Object3d" />

module CanvasToy{

    /*
     * @author Danielhu229 http://hustdanielhu.com
     */
    export class RenderNode extends Object3d{

        protected parent:RenderNode;

        protected children:Array<RenderNode>;

        protected relativeMatrix:Mat4Array;

        constructor(gl:WebGLRenderingContext){
            super(gl);
            this.parent = null;
            this.children = [];
            this.relativeMatrix = mat4.create();
        }

        public addChild(child:RenderNode){
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

        public draw(camera:Camera){
            this.matrix = mat4.mul(mat4.create(), camera.projectionMatrix, this.modelViewMatrix);
        }
    }
}
