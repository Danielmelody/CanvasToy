/// <reference path="./RenderNode.ts"/>

module CanvasToy{

    export class Scene extends RenderNode{

        public renderObjects:Array<Object3d>;

        constructor(){
            super();
        }

        draw(gl, Camera){
            super.draw(gl, Camera);
        }

        addChild(child){
            super.addChild(child);
            this.renderObjects.push(child);
        }
    }
}
