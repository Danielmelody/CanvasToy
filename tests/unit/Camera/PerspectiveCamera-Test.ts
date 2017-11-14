import * as CanvasToy from "../../../src/CanvasToy";

describe("PerspectiveCamera testing", () => {
    it("function adapTargetRadio", () => {
        const camera = new CanvasToy.PerspectiveCamera();
        const x = Math.random() % 100;
        const y = Math.random() % 100;
        camera.setAspectRadio(x / y);
        (expect(camera.aspect) as jasmine.ToyMatchers).toBeEqualish(x / y);
    });
});
