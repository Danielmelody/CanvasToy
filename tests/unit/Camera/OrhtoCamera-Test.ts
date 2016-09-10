module Testing {
    describe('OrhtoCamera testing', () => {
        it("function adapTargetRadio", () => {
            let canvas = Testing.createCanvas(512, 512);
            CanvasToy.setCanvas(canvas);
            let camera = new CanvasToy.OrthoCamera();
            let x = Math.random() % 100;
            let y = Math.random() % 100;
            camera.adaptTargetRadio({
                width: x,
                height: y
            });
            expect((camera.right - camera.left) / (camera.top - camera.bottom)).toEqual(x / y);
        })
    });
}
