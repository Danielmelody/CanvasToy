/// <reference path="./CanvasToy.ts"/>

module CanvasToy {

    export abstract class Object3d {

        public name: string;

        public scene: Scene;

        public localMatrix: Mat4Array = mat4.create();

        public matrix: Mat4Array = mat4.create();

        public position: Vec3Array = vec4.create();

        public size: Vec3Array = vec3.create();

        public rotate: Vec3Array = vec3.create();

        protected updateEvents: Array<Function> = [];

        protected startEvents: Array<Function> = [];

        constructor() {
            this.registerUpdate(() => {
                this.apply();
            });
        }

        public abstract apply();

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

        public update(dt: number) {
            for (let event of this.updateEvents) {
                event(dt);
            }
        }

        public translate(deltaX: number, deltaY: number, deltaZ: number) {
            this.localMatrix = mat4.translate(mat4.create(), this.localMatrix, vec3.fromValues(deltaX, deltaY, deltaZ));
        }

        public translateTo(deltaX: number, deltaY: number, deltaZ: number) { }

        public rotateX(angle: number) {
            this.localMatrix = mat4.rotateX(mat4.create(), this.localMatrix, angle);
        }

        public rotateY(angle: number) {
            this.localMatrix = mat4.rotateY(mat4.create(), this.localMatrix, angle);
        }

        public rotateZ(angle: number) {
            this.localMatrix = mat4.rotateZ(mat4.create(), this.localMatrix, angle);
        }

        public scale(rateX: number, rateY?: number, rateZ?: number) {
            if (rateY == undefined) {
                var rateY = rateX;
            }
            if (rateZ == undefined) {
                var rateZ = rateX;
            }
            this.localMatrix = mat4.scale(mat4.create(), this.localMatrix, vec3.fromValues(rateX, rateY, rateZ));
        }

    }
}
