function start(){
    var canvas = document.getElementById('canvas');
    CanvasToy.setCanvas(canvas);
    var scene = new CanvasToy.Scene();
    var camera = new CanvasToy.PerspectiveCamera();
    CanvasToy.ModelLoader.loadObj('models/gun/Handgun_obj.obj');
}
