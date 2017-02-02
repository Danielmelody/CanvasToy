
examples.push((canvas: HTMLCanvasElement) => {
    const renderer = new CanvasToy.Renderer(canvas);

    const scene = new CanvasToy.Scene();
    const camera = new CanvasToy.PerspectiveCamera();

    const node = new CanvasToy.Object3d();

    const image = new Image();

    image.src = "basic/images/chrome.png";
    const mainTexture = new CanvasToy.Texture2D(renderer.gl, image);

    const material = new CanvasToy.StandardMaterial(renderer.gl, {
        mainTexture,
        specular: [1, 1, 1],
    });

    const mesh1 = new CanvasToy.Mesh(
        new CanvasToy.CubeGeometry(renderer.gl),
        [material],
    );

    const mesh2 = new CanvasToy.Mesh(
        new CanvasToy.CubeGeometry(renderer.gl),
        [new CanvasToy.StandardMaterial(renderer.gl, { mainTexture })],
    );

    mesh1.setParent(node);
    mesh2.setParent(node);
    scene.addObject(node);
    scene.addObject(camera);
    const light = new CanvasToy.PointLight().setPosition([100, 0, 100]);
    scene.addLight(light);

    mesh1.translate([2, 0, 0]);
    mesh2.translate([-2, 0, 0]);

    node.translate([0, 0, -10.0]);

    mesh1.registUpdate((deltaTime) => {
        node.rotateY(0.01);
    });
    renderer.render(scene, camera);
    return renderer;
});
