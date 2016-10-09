namespace Testing {

    class Object3dIm extends CanvasToy.Object3d {
        public apply() { };
        public registUpdateTest() {
            let updateFun = () => {
                console.log('registUpdate');
            };
            this.registUpdate(updateFun);
            expect(this.updateEvents).toContain(updateFun);
        }
        public registStartTest() {
            let startFun = () => {
                console.log('registStart');
            };
            this.registStart(startFun);
            expect(this.startEvents).toContain(startFun);
        }
    }
    describe('Object3d testing', () => {
        beforeAll(() => {
            let canvas = Testing.createCanvas(512, 512);
            CanvasToy.setCanvas(canvas);
        })
        it("function registUpdate", () => {
            let object3d = new Object3dIm();
            object3d.registUpdateTest();
        });
        it("function startUpdate", () => {
            let object3d = new Object3dIm();
            object3d.registStartTest();
            object3d.registStartTest();
        });
        it("function addChild", () => {
            let parent = new CanvasToy.Object3d();
            let child = new CanvasToy.Object3d();
            parent.addChild(child);
            expect(parent.children).toContain(child);
            expect(child.parent).toBe(parent);
        })
        it("function apply", () => {
            let object3d = new CanvasToy.Object3d();
            object3d.apply();
        })
    });
}
