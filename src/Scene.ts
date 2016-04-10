/// <reference path="./Node.ts"/>

module CanvasToy{

    export class Scene{

        public objects:Array<Object3d>;

        public clearColor:Array<number>;

        constructor(){
            this.objects = [];
            this.clearColor = [0, 0, 0, 0];
            window.setInterval(() => this.update(1000/60), 1000 / 60);
        }

        update(dt:Number) {
            for(let object of this.objects) {
                object.update(dt);
            }
        }

        addObject(object:Object3d) {
            this.objects.push(object);
        }
    }
}
