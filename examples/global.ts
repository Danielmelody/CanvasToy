import { Camera } from "cameras/Camera";
import * as CanvasToy from "CanvasToy";
import { vec2 } from "gl-matrix";

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

export function onMouseEvent(renderer: CanvasToy.Renderer, camera: Camera) {
    const canvas = renderer.canvas;
    canvas.onmousedown = (ev: MouseEvent) => {
        if (ev.button === 2) {
            camera.controlEnable = true;
            canvas.oncontextmenu = (ev) => {
                ev.preventDefault();
            };
            canvas.style.cursor = "none";
            canvas.requestPointerLock();
        }
    };
    canvas.onmouseup = (ev: MouseEvent) => {
        if (ev.button === 2) {
            camera.controlEnable = false;
            canvas.style.cursor = "auto";
            canvas.ownerDocument.exitPointerLock();
        }
    };
    canvas.onmousemove = (ev: MouseEvent) => {
        const mouseSensitivity = 0.05;
        if (camera.controlEnable === true) {
            const deltaAngle = vec2.fromValues(
                ev.movementX * mouseSensitivity,
                -ev.movementY * mouseSensitivity,
            );
            camera.changeDirectionByAngle(deltaAngle);
        }
    };
    canvas.onwheel = (ev: WheelEvent) => {
        const zoomSensitivity = 0.01;
        if (camera.controlEnable === true) {
            ev.preventDefault();
            camera.changeZoom(ev.deltaY * zoomSensitivity);
        }
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
