
/// <reference path="./CanvasToy.ts"/>

module CanvasToy{

    export class Object3d{

        public modelViewMatrix:Mat4Array;

        public matrix:Mat4Array;

        protected position:Vec3Array;

        protected size:Vec3Array;

        protected rotate:Vec3Array;

        constructor(){
            this.modelViewMatrix = mat4.create();
            this.matrix = mat4.create();
            this.position = vec3.create();
            this.size = vec3.create();
        }

        public start () {

        }

        public update () {

        }

        public translate () {
        }

        public translateTo (deltaX:Number, deltaY:Number, deltaZ:Number) {
            this.modelViewMatrix = mat4.translate(mat4.create(), this.modelViewMatrix, vec3.fromValues(deltaX, deltaY, deltaZ));
        }

        public rotateX(angle:number){
            this.modelViewMatrix = mat4.rotateX(mat4.create(), this.matrix, angle);
        }

        public rotateY(angle:number){
            this.modelViewMatrix = mat4.rotateY(mat4.create(), this.matrix, angle);
        }

        public rotateZ(angle:number){
            this.modelViewMatrix = mat4.rotateY(mat4.create(), this.matrix, angle);
        }

        public scale (rateX:number, rateY:number, rateZ:number) {
            this.modelViewMatrix = mat4.scale(mat4.create(), this.modelViewMatrix, vec3.fromValues(rateX, rateY, rateZ));
        }

    }
}
