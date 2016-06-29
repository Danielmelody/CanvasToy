/// <reference path="./Node.ts"/>

module CanvasToy{

    export class Scene{

        public objects:Array<Object3d> = [];

        public lights:Array<Light> = [];

        public ambientLight:Vec3Array = vec3.fromValues(0, 0, 0);

        public openLight: boolean = true;

        public enableShadowMap: boolean = false;

        public clearColor:Array<number> = [0, 0, 0, 0];

        constructor() {
            window.setInterval(() => this.update(1000/60), 1000 / 60);
        }

        update(dt:Number) {
            for(let object of this.objects) {
                object.update(dt);
            }
        }

        addObject(object:Object3d) {
            this.objects.push(object);
            object.scene = this;
        }

        addLight(light:Light) {
            this.lights.push(light);
            light.scene = this;
        }
    }
}
