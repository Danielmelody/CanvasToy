namespace Testing {

    let object3d = undefined;

    class Object3dIm extends CanvasToy.Object3d {
        constructor() {
            super();
        }
    }

    describe("test Object3d", () => {
        beforeEach(() => {
            object3d = new Object3dIm();
        });
        it("constructor", () => { expect(object3d).toBeDefined(); });

        describe("set localPosition", () => {

            describe("on root object", () => {
                beforeEach(() => {
                    object3d.localPosition = vec3.fromValues(1, 2, 3);
                });
                it("should not be the same refer to the global postion", () => {
                    expect(object3d.localPosition).not.toBe(object3d.position);
                });
                it("should change the local position", () => {
                    expect(object3d._localPosition).toBeEqualish(vec3.fromValues(1, 2, 3));
                });
                it("should change the global postion", () => {
                    expect(object3d._position).toBeEqualish(vec3.fromValues(1, 2, 3));
                });
            });

            describe("on no-root object", () => {
                beforeEach(() => {
                    let parent = new Object3dIm();
                    parent.addChild(object3d);
                    parent.localPosition = vec3.fromValues(1, 2, 3);
                    object3d.localPosition = vec3.fromValues(1, 2, 3);
                });
                it("should change the local position", () => {
                    expect(object3d.localPosition).toBeEqualish(vec3.fromValues(1, 2, 3));
                });
                it("should change the global postion", () => {
                    expect(object3d.position).toBeEqualish(vec3.fromValues(2, 4, 6));
                });
            });
        });

        describe("set position", () => {

            describe("on root object", () => {
                beforeEach(() => {
                    object3d.position = vec3.fromValues(1, 2, 3);
                });
                it("should not be the same refer to the local postion", () => {
                    expect(object3d.position).not.toBe(object3d.localPosition);
                });
                it("should change the global postion", () => {
                    expect(object3d.position).toBeEqualish(vec3.fromValues(1, 2, 3));
                });
                it("should change the local position", () => {
                    expect(object3d.localPosition).toBeEqualish(vec3.fromValues(1, 2, 3));
                });
                it("should change children", () => {
                    let child = new Object3dIm();
                    object3d.addChild(child);
                    object3d.position = vec3.fromValues(0, 0, 0);
                    child.position = vec3.fromValues(1, 2, 3);
                    object3d.position = vec3.fromValues(1, 2, 3);
                    let result = vec3.fromValues(2, 4, 6);
                    expect(child.position).toBeEqualish(result);
                });
            });

            describe("on no-root object", () => {
                beforeEach(() => {
                    let parent = new Object3dIm();
                    parent.addChild(object3d);
                    parent.position = vec3.fromValues(1, 2, 3);
                    object3d.position = vec3.fromValues(2, 4, 6);
                });
                it("should change the global postion", () => {
                    expect(object3d.position).toBeEqualish(vec3.fromValues(2, 4, 6));
                });
                it("should change the local position", () => {
                    expect(object3d.localPosition).toBeEqualish(vec3.fromValues(1, 2, 3));
                });
            });

        });

        describe("set local rotation", () => {

            describe("on root object", () => {
                beforeEach(() => {
                    object3d.localRotation = quat.fromValues(0, 1, 0, 0);
                });
                it("should not be the same refer to the global rotation", () => {
                    expect(object3d.localRotation).not.toBe(object3d.rotation);
                });
                it("should change the local rotation", () => {
                    expect(object3d.localRotation).toBeEqualish(quat.fromValues(0, 1, 0, 0));
                });
                it("should change the global rotation", () => {
                    expect(object3d.rotation).toBeEqualish(quat.fromValues(0, 1, 0, 0));
                });
                it("should be normalized", () => {
                    object3d.localRotation = quat.fromValues(1, 2, 3, 4);
                    expect(quat.length(object3d.localRotation)).toBeEqualish(1);
                });
            });

            describe("on no-root object", () => {
                let result;
                beforeEach(() => {
                    let tempRotation = quat.create();
                    let parent = new Object3dIm();
                    parent.addChild(object3d);
                    parent.localRotation = quat.rotateX(parent.localRotation, quat.create(), 1);
                    object3d.localRotation = quat.rotateY(object3d.localRotation, quat.create(), 1);
                    result = quat.rotateY(tempRotation, quat.rotateX(tempRotation, quat.create(), 1), 1);
                });
                it("should be combined", () => {
                    expect(object3d.rotation)
                        .toBeEqualish(result);
                });
            });
        });

        describe("set global rotation", () => {
            describe("on root object", () => {
                beforeEach(() => {
                    object3d.rotation = quat.fromValues(0, 1, 0, 0);
                });
                it("should not be the same refer to the local rotation", () => {
                    expect(object3d.rotation).not.toBe(object3d.localRotation);
                });
                it("should change the global rotation", () => {
                    expect(object3d.rotation).toBeEqualish(quat.fromValues(0, 1, 0, 0));
                });
                it("should change the local rotation", () => {
                    expect(object3d.localRotation).toBeEqualish(quat.fromValues(0, 1, 0, 0));
                });
                it("should be normalized", () => {
                    object3d.rotation = quat.fromValues(1, 2, 3, 4);
                    expect(quat.length(object3d.rotation)).toBeEqualish(1);
                });
                it("should change children", () => {
                    let child = new Object3dIm();
                    object3d.addChild(child);
                    object3d.rotation = quat.create();
                    child.rotation = quat.rotateY(quat.create(), quat.create(), 1);
                    object3d.rotation = quat.rotateX(quat.create(), quat.create(), 1);
                    let result = quat.rotateY(quat.create(), quat.rotateX(quat.create(), quat.create(), 1), 1);
                    expect(child.rotation).toBeEqualish(result);
                });
            });

            describe("on no-root object", () => {
                let result;
                beforeEach(() => {
                    let parent = new Object3dIm();
                    parent.addChild(object3d);
                    parent.rotation = quat.rotateX(parent.rotation, quat.create(), 1);
                    object3d.rotation = quat.rotateY(object3d.rotation, parent.rotation, 1);
                    result = quat.rotateY(quat.create(), quat.create(), 1);
                });
                it("should change the local rotation", () => {
                    expect(object3d.localRotation)
                        .toBeEqualish(result);
                });
            });

        })

    });
}
