import * as CanvasToy from "../../../src/CanvasToy";

describe("OrhtoCamera testing", () => {
    it("function adapTargetRadio", () => {
        const camera = new CanvasToy.OrthoCamera();
        const x = Math.random() % 100;
        const y = Math.random() % 100;
        camera.setAspectRadio(x / y);
        (expect((camera.right - camera.left) / (camera.top - camera.bottom)) as jasmine.ToyMatchers)
            .toBeEqualish(x / y);
    });
});
