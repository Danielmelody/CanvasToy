let examples: Array<(canvas: HTMLCanvasElement) => CanvasToy.Renderer> = [];

function onMouseOnStart(renderer: CanvasToy.Renderer) {
    renderer.canvas.onmouseover = () => {
        renderer.start();
    };
    renderer.canvas.onmouseleave = () => {
        renderer.stop();
    };
}

function createSkyBox(renderer: CanvasToy.Renderer, cubeTexture) {
    return new CanvasToy.Mesh(
        new CanvasToy.CubeGeometry(renderer.gl),
        [new CanvasToy.SkyMaterial(renderer.gl, cubeTexture)],
    );
}
