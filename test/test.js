function start(){
    var canvas = document.getElementById('canvas');
    var renderer = new CanvasToy.Renderer(canvas);
    var Scene = new CanvasToy.Scene();
    var Camera = new CanvasToy.Camera();
    renderer.render(Scene, Camera);
}
