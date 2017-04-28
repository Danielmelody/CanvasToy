import * as CanvasToy from "CanvasToy";

export const examples = [];
export function createSkyBox(renderer: CanvasToy.Renderer, cubeTexture) {
    return new CanvasToy.Mesh(
        new CanvasToy.CubeGeometry(renderer.gl),
        [new CanvasToy.SkyMaterial(renderer.gl, cubeTexture)],
    );
}

export function onMouseOnStart(renderer: CanvasToy.Renderer) {
    renderer.canvas.onmouseover = () => {
        renderer.start();
    };
    renderer.canvas.onmouseleave = () => {
        renderer.stop();
    };
}

export function createCanvas() {
    const table = document.getElementById("table");
    const newCanvas = document.createElement("canvas");
    newCanvas.width = 960;
    newCanvas.height = 540;
    newCanvas.style.background = "black";
    table.appendChild(newCanvas);
    return newCanvas;
}
