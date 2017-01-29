let examples: Array<(canvas: HTMLCanvasElement) => CanvasToy.Renderer> = [];

function onMouseOnStart(renderer: CanvasToy.Renderer) {
    renderer.canvas.onmouseover = () => {
        renderer.start();
    };
    renderer.canvas.onmouseleave = () => {
        renderer.stop();
    };
}
