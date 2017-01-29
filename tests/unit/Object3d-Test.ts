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

        describe("set parent", () => {
            it("should be child of parent", () => {
                let parent = new Object3dIm();
                object3d.setParent(parent);
                expect(parent.children).toContain(object3d);
            });
        });


        describe("set localPosition", () => {

            describe("on root object", () => {
                beforeEach(() => {
                    object3d.setLocalPosition(vec3.fromValues(1, 2, 3));
                });
                it("should not be the same refer to the global postion", () => {
                    expect(object3d.localPosition).not.toBe(object3d.position);
                });
                it("should change the local position", () => {
                    (<jasmine.ToyMatchers>expect(object3d._localPosition)).toBeEqualish(vec3.fromValues(1, 2, 3));
                });
                it("should change the global postion", () => {
                    (<jasmine.ToyMatchers>expect(object3d._position)).toBeEqualish(vec3.fromValues(1, 2, 3));
                });
            });

            describe("on no-root object", () => {
                beforeEach(() => {
                    let parent = new Object3dIm();
                    object3d.setParent(parent);
                    parent.setLocalPosition(vec3.fromValues(1, 2, 3));
                    object3d.setLocalPosition(vec3.fromValues(1, 2, 3));
                });
                it("should change the local position", () => {
                    (<jasmine.ToyMatchers>expect(object3d.localPosition)).toBeEqualish(vec3.fromValues(1, 2, 3));
                });
                it("should change the global postion", () => {
                    (<jasmine.ToyMatchers>expect(object3d.position)).toBeEqualish(vec3.fromValues(2, 4, 6));
                });
            });
        });

        describe("set position", () => {

            describe("on root object", () => {
                beforeEach(() => {
                    object3d.setPosition(vec3.fromValues(1, 2, 3));
                });
                it("should not be the same refer to the local postion", () => {
                    expect(object3d.position).not.toBe(object3d.localPosition);
                });
                it("should change the global postion", () => {
                    (<jasmine.ToyMatchers>expect(object3d.position)).toBeEqualish(vec3.fromValues(1, 2, 3));
                });
                it("should change the local position", () => {
                    (<jasmine.ToyMatchers>expect(object3d.localPosition)).toBeEqualish(vec3.fromValues(1, 2, 3));
                });
                it("should change children", () => {
                    let child = new Object3dIm();
                    child.setParent(object3d);
                    object3d.setPosition(vec3.fromValues(0, 0, 0));
                    child.setPosition(vec3.fromValues(1, 2, 3));
                    object3d.setPosition(vec3.fromValues(1, 2, 3));
                    let result = vec3.fromValues(2, 4, 6);
                    (<jasmine.ToyMatchers>expect(child.position)).toBeEqualish(result);
                });
            });

            describe("on no-root object", () => {
                beforeEach(() => {
                    let parent = new Object3dIm();
                    object3d.setParent(parent);
                    parent.setPosition(vec3.fromValues(1, 2, 3));
                    object3d.setPosition(vec3.fromValues(2, 4, 6));
                });
                it("should change the global postion", () => {
                    (<jasmine.ToyMatchers>expect(object3d.position)).toBeEqualish(vec3.fromValues(2, 4, 6));
                });
                it("should change the local position", () => {
                    (<jasmine.ToyMatchers>expect(object3d.localPosition)).toBeEqualish(vec3.fromValues(1, 2, 3));
                });
            });

        });

        describe("set local rotation", () => {

            describe("on root object", () => {
                beforeEach(() => {
                    object3d.setLocalRotation(quat.fromValues(0, 1, 0, 0));
                });
                it("should not be the same refer to the global rotation", () => {
                    expect(object3d.localRotation).not.toBe(object3d.rotation);
                });
                it("should change the local rotation", () => {
                    (<jasmine.ToyMatchers>expect(object3d.localRotation)).toBeEqualish(quat.fromValues(0, 1, 0, 0));
                });
                it("should change the global rotation", () => {
                    (<jasmine.ToyMatchers>expect(object3d.rotation)).toBeEqualish(quat.fromValues(0, 1, 0, 0));
                });
                it("should be normalized", () => {
                    object3d.localRotation = quat.fromValues(1, 2, 3, 4);
                    (<jasmine.ToyMatchers>expect(quat.length(object3d.localRotation))).toBeEqualish(1);
                });
            });

            describe("on no-root object", () => {
                let result;
                beforeEach(() => {
                    let tempRotation = quat.create();
                    let parent = new Object3dIm();
                    object3d.setParent(parent);
                    parent.setLocalRotation(quat.rotateX(parent.localRotation, quat.create(), 1));
                    object3d.setLocalRotation(quat.rotateY(object3d.localRotation, quat.create(), 1));
                    result = quat.rotateY(tempRotation, quat.rotateX(tempRotation, quat.create(), 1), 1);
                });
                it("should be combined", () => {
                    (<jasmine.ToyMatchers>expect(object3d.rotation))
                        .toBeEqualish(result);
                });
            });
        });

        describe("set global rotation", () => {
            describe("on root object", () => {
                beforeEach(() => {
                    object3d.setRotation(quat.fromValues(0, 1, 0, 0));
                });
                it("should not be the same refer to the local rotation", () => {
                    expect(object3d.rotation).not.toBe(object3d.localRotation);
                });
                it("should change the global rotation", () => {
                    (<jasmine.ToyMatchers>expect(object3d.rotation)).toBeEqualish(quat.fromValues(0, 1, 0, 0));
                });
                it("should change the local rotation", () => {
                    (<jasmine.ToyMatchers>expect(object3d.localRotation)).toBeEqualish(quat.fromValues(0, 1, 0, 0));
                });
                it("should be normalized", () => {
                    object3d.rotation = quat.fromValues(1, 2, 3, 4);
                    (<jasmine.ToyMatchers>expect(quat.length(object3d.rotation))).toBeEqualish(1);
                });
                it("should change children", () => {
                    let child = new Object3dIm();
                    child.setParent(object3d);
                    object3d.setRotation(quat.create());
                    child.setRotation(quat.rotateY(quat.create(), quat.create(), 1));
                    object3d.setRotation(quat.rotateX(quat.create(), quat.create(), 1));
                    let result = quat.rotateY(quat.create(), quat.rotateX(quat.create(), quat.create(), 1), 1);
                    (<jasmine.ToyMatchers>expect(child.rotation)).toBeEqualish(result);
                });
            });

            describe("on no-root object", () => {
                let result;
                beforeEach(() => {
                    let parent = new Object3dIm();
                    object3d.setParent(parent);
                    parent.setRotation(quat.rotateX(parent.rotation, quat.create(), 1));
                    object3d.setRotation(quat.rotateY(object3d.rotation, parent.rotation, 1));
                    result = quat.rotateY(quat.create(), quat.create(), 1);
                });
                it("should change the local rotation", () => {
                    (<jasmine.ToyMatchers>expect(object3d.localRotation))
                        .toBeEqualish(result);
                });
            });
        });

        describe("set transform from parent", () => {
            let parent;
            let childLastLocalMatrix;
            let expectedGlobalMatrix;
            beforeEach(() => {
                parent = new Object3dIm();
                spyOn(parent, "setTransformFromParent");
                parent.setLocalPosition(vec3.fromValues(1, 2, 3));
                parent.setLocalRotation(quat.rotateX(quat.create(), quat.create(), 1));
                parent.setLocalScaling(vec3.fromValues(4, 5, 6));
                object3d.setLocalPosition(vec3.fromValues(1, 2, 3));
                object3d.setLocalRotation(quat.rotateX(quat.create(), quat.create(), 1));
                object3d.setLocalScaling(vec3.fromValues(4, 5, 6));
                childLastLocalMatrix = mat4.clone(object3d.localMatrix);
                expectedGlobalMatrix = mat4.mul(mat4.create(), parent.localMatrix, object3d.localMatrix);
                object3d.setParent(parent);
            });
            it("should not be called to root object", () => {
                expect(parent.setTransformFromParent).not.toHaveBeenCalled();
            })
            it("should not change child local matrix", () => {
                object3d.setTransformFromParent();
                (<jasmine.ToyMatchers>expect(object3d.localMatrix)).toBeEqualish(childLastLocalMatrix);
            });
            it("should not change child local position", () => {
                object3d.setTransformFromParent();
                (<jasmine.ToyMatchers>expect(object3d.localPosition)).toBeEqualish(vec3.fromValues(1, 2, 3));
            });
            it("should not change child local rotation", () => {
                object3d.setTransformFromParent();
                (<jasmine.ToyMatchers>expect(object3d.localRotation)).toBeEqualish(quat.rotateX(quat.create(), quat.create(), 1));
            });
            it("should not change child local scaling", () => {
                object3d.setTransformFromParent();
                (<jasmine.ToyMatchers>expect(object3d.localScaling)).toBeEqualish(vec3.fromValues(4, 5, 6));
            });
            it("should change child global matrix", () => {
                object3d.setTransformFromParent();
                (<jasmine.ToyMatchers>expect(object3d.matrix)).toBeEqualish(expectedGlobalMatrix);
            });
            it("should change child global position", () => {
                object3d.setTransformFromParent();
                (<jasmine.ToyMatchers>expect(object3d.position)).toBeEqualish(mat4.getTranslation(vec3.create(), expectedGlobalMatrix));
            });
        });
    });
}
