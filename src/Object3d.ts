
/// <reference path="./CanvasToy.ts"/>

module CanvasToy{

    export class Object3d{

        protected modelViewMatrix:Mat4Array;

        protected matrix:Mat4Array;

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

        public scale () {

        }

    }
}
