<<<<<<< HEAD
import * as CanvasToy from "../../../src/CanvasToy";

describe("PerspectiveCamera testing", () => {
    it("function adapTargetRadio", () => {
        const camera = new CanvasToy.PerspectiveCamera();
        const x = Math.random() % 100;
        const y = Math.random() % 100;
        camera.adaptTargetRadio({
            width: x,
            height: y,
        });
        (expect(camera.aspect) as jasmine.ToyMatchers).toBeEqualish(x / y);
=======
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
            (expect(camera.aspect) as jasmine.ToyMatchers).toBeEqualish(x / y);
        })
>>>>>>> 27045efafcc77c19e253440ff95c33962e44e436
    });
});
