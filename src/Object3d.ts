
/// <reference path="./CanvasToy.ts"/>

module CanvasToy {

    export class Object3d {

        public scene: Scene;

        public modelViewMatrix: Mat4Array;

        public matrix: Mat4Array;

        public position: Vec3Array;

        public size: Vec3Array;

        public rotate: Vec3Array;

        protected updateEvents: Array<Function> = [];

        protected startEvents: Array<Function> = [];

        constructor() {
            this.modelViewMatrix = mat4.create();
            this.translate(0, 0, 0);
            this.matrix = mat4.create();
            this.position = vec4.create();
            this.size = vec3.create();
        }

        public registerUpdate(updateFunction: Function) {
            this.updateEvents.push(updateFunction);
        }

        public registerStart(updateFunction: Function) {
            this.startEvents.push(updateFunction);
        }

        public start() {
            for (let event of this.startEvents) {
                event();
            }
        }

        public update(dt: Number) {
            for (let event of this.updateEvents) {
                event(dt);
            }
        }

        public translate(deltaX: Number, deltaY: Number, deltaZ: Number) {
            this.modelViewMatrix = mat4.translate(mat4.create(), this.modelViewMatrix, vec3.fromValues(deltaX, deltaY, deltaZ));
        }

        public translateTo(deltaX: Number, deltaY: Number, deltaZ: Number) { }

        public rotateX(angle: number) {
            this.modelViewMatrix = mat4.rotateX(mat4.create(), this.modelViewMatrix, angle);
        }

        public rotateY(angle: number) {
            this.modelViewMatrix = mat4.rotateY(mat4.create(), this.modelViewMatrix, angle);
        }

        public rotateZ(angle: number) {
            this.modelViewMatrix = mat4.rotateZ(mat4.create(), this.modelViewMatrix, angle);
        }

        public scale(rateX: number, rateY?: number, rateZ?: number) {
            if (rateY == undefined) {
                var rateY = rateX;
            }
            if (rateZ == undefined) {
                var rateZ = rateX;
            }
            this.modelViewMatrix = mat4.scale(mat4.create(), this.modelViewMatrix, vec3.fromValues(rateX, rateY, rateZ));
        }

    }
}
