/*
 * @author Danielhu229 http://hustdanielhu.com
 */

var Scene = function(canvas) {


}

Scene.prototype = Object.create(RenderNode);
Scene.prototype.constructor = RenderNode;

Scene.prototype.draw = function (){
    var self = this;
    return function (){
        self.gl.clear(self.gl.COLOR_BUFFER_BIT | self.gl.DEPTH_BUFFER_BIT);
    }
}

Scene.prototype.bindMatrix = function () {
    
}

function start(){
    var canvas = document.getElementById('canvas');
    var webgl = new Scene(canvas);

}