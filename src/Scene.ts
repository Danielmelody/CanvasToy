/// <reference path="./LogicNode.ts"/>

module CanvasToy{

    export class Scene extends LogicNode{

        public renderObjects:Array<Drawable>;

        public clearColor:Array<number>;

        constructor(){
            super();
        }

        addChild(child){
            super.addChild(child);
            this.renderObjects.push(child);
        }
    }
}
