
module Testing {
    export function createCanvas(width: number, height: number) {
        let canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        document.body.appendChild(canvas);
        return canvas;
    }
}
