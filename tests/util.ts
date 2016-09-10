
module Testing {
    export function createCanvas(width: number, height: number) {
        let canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        canvas.style.backgroundColor = 'black';
        document.body.appendChild(canvas);
        return canvas;
    }
}
