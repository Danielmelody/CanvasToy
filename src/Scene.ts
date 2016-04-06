/// <reference path="./Node.ts"/>

module CanvasToy{

    export class Scene{

        public renderObjects:Array<Drawable>;

        public world:Node;

        public clearColor:Array<number>;

        constructor(){
            this.renderObjects = [];
            this.clearColor = [0, 0, 0, 0];
            this.world = new Node();
            this.addObject(this.world);
        }

        addObject(object:Drawable){
            this.renderObjects.push(object);
        }
    }
}
