/// <reference path="./Node.ts"/>

module CanvasToy {

    export class Scene {

        // TODO: optimize objects storage management;
        public objects: Array<Object3d> = [];

        public lights: Array<Light> = [];

        public ambientLight: Vec3Array = vec3.fromValues(0, 0, 0);

        public openLight: boolean = true;

        public enableShadowMap: boolean = false;

        public clearColor: Array<number> = [0, 0, 0, 0];

        constructor() {
            window.setInterval(() => this.update(1000 / 60), 1000 / 60);
        }

        update(dt: number) {
            for (let object of this.objects) {
                object.update(dt);
            }
        }

        addObject(object: Object3d) {
            this.objects.push(object);
            object.scene = this;
            if (object instanceof Node) {
                let node = <Node>object;
                console.log(node);
                node.children.forEach((child) => {
                    this.addObject(child);
                    console.log(child);
                })
            }
        }

        removeObject(object: Object3d) {
            if (object instanceof Node) {
                let node = <Node>object;
                node.children.forEach((child) => {
                    this.removeObject(child);
                })
            }
            this.objects.splice(this.objects.indexOf(object));
        }

        addLight(light: Light) {
            this.lights.push(light);
            light.scene = this;
        }
    }
}
