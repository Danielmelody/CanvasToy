/// <reference path="./Object3d.ts"/>

namespace CanvasToy {

    export class Scene {

        // TODO: optimize objects storage management;
        public objects: Object3d[] = [];

        public lights: Light[] = [];

        public ambientLight: Vec3Array = vec3.fromValues(0, 0, 0);

        public openLight: boolean = false;

        public enableShadowMap: boolean = false;

        public clearColor: number[] = [0, 0, 0, 0];

        public programSetUp: boolean = false;

        constructor() {
            window.setInterval(() => this.update(1000 / 60), 1000 / 60);
        }

        public update(dt: number) {
            for (const object of this.objects) {
                if (!object.parent) {
                    object.update(dt);
                }
            }
        }

        public addObject(object: Object3d) {
            this.objects.push(object);
            object.scene = this;
            object.children.forEach((child) => {
                this.addObject(child);
            });
            return this;
        }

        public removeObject(object: Object3d) {

            object.children.forEach((child) => {
                this.removeObject(child);
            });
            this.objects.splice(this.objects.indexOf(object));
            return this;
        }

        public addLight(light: Light) {
            this.openLight = true;
            this.lights.push(light);
            light.scene = this;
            return this;
        }
    }
}
