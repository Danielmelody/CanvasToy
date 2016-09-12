module Testing {
    describe('Node testing', () => {
        beforeAll(() => {
            let canvas = Testing.createCanvas(512, 512);
            CanvasToy.setCanvas(canvas);
        })
        it("function addChild", () => {
            let parent = new CanvasToy.Node();
            let child = new CanvasToy.Node();
            parent.addChild(child);
            expect(parent.children).toContain(child);
            expect(child.parent).toBe(parent);
        })
        it("function apply", () => {
            let node = new CanvasToy.Node();
            node.apply();
        })
    });
}
