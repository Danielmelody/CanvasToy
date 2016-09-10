module Testing {
    describe('Node testing', () => {
        let node : CanvasToy.Node = null;
        let parent : CanvasToy.Node = null;
        let child : CanvasToy.Node = null;
        beforeAll(() => {
            let canvas = Testing.createCanvas(512, 512);
            CanvasToy.setCanvas(canvas);
        })
        it("function addChild", () => {
            parent.addChild(child);
            expect(parent.children).toContain(child);
            expect(child.parent).toBe(parent);
        })
        it("function apply", () => {
            node = new CanvasToy.Node();
            node.apply();
        })
    });
}
