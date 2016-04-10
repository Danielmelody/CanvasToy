/// <reference path="./Object3d" />

module CanvasToy{

    /*
     * @author Danielhu229 http://hustdanielhu.com
     */
    export class Node extends Object3d{

        protected parent:Node;

        protected scene:Scene;

        protected children:Array<Node>;

        protected relativeMatrix:Mat4Array;

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

        public draw(camera:Camera){
            var mvUniform = engine.getUniformLocation("modelViewMatrix");
            engine.gl.uniformMatrix4fv(mvUniform, false, new Float32Array(this.modelViewMatrix));
            var pMUniform = engine.getUniformLocation("projectionMatrix");
            engine.gl.uniformMatrix4fv(pMUniform, false, new Float32Array(camera.projectionMatrix));
        }
    }
}
