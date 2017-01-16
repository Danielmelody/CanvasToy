namespace Testing {
    describe('PerspectiveCamera testing', () => {
        it("function adapTargetRadio", () => {
            let camera = new CanvasToy.PerspectiveCamera();
            let x = Math.random() % 100;
            let y = Math.random() % 100;
            camera.adaptTargetRadio({
                width: x,
                height: y
            });
            expect(camera.aspect).toEqual(x / y);
        })
    });
}
