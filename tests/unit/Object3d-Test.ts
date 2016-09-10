module Testing {
    class Object3dIm extends CanvasToy.Object3d{
        public apply(){};
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
        });
    });
}
