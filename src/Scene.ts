/// <reference path="./RenderNode.ts"/>

module CanvasToy{

    export class Scene extends RenderNode{

        public renderObjects:Array<Object3d>;

        constructor(gl:WebGLRenderingContext){
            super(gl);

        }

        draw(Camera){
            super.draw(Camera);
        }

        addChild(child){
            super.addChild(child);
            this.renderObjects.push(child);
        }
    }
}
