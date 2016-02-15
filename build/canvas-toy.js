/*
 * @author Danielhu229 http://hustdanielhu.com
 */

CanvasToy.Camera = function () {
    this.projectionMatrix = mat4.create();
};

CanvasToy.Camera.prototype = Object3d.create(Object3d.prototype);
CanvasToy.Camera.prototype.constructor = Camera;

CanvasToy.Camera.prototype.lookAt = function(eye, center, up){
    this.projectionMatrix.lookAt(eye, center, up);
};
var CanvasToy = {};
/*
 * @author Danielhu229 http://hustdanielhu.com
 */

CanvasToy.Mesh = function (geometry, material) {
    this.geometry = geometry || new Geometry();
    this.material = material || new Material();
};

CanvasToy.Mesh.prototype = Object.create(CanvasToy.RenderNode.prototype);
CanvasToy.Mesh.prototype.constructor = CanvasToy.RenderNode;

CanvasToy.Mesh.prototype.draw = function(webglContext, camera){
    RenderNode.draw.call(this);
    webglContext.bufferData(
        webglContext.ARRAY_BUFFER,
        new Float32Array(this.geometry.vertices),
        this.webglContext.STATIC_DRAW
    );
    webglContext.drawArrays(webglContext.TRIANGLE_STRIP, 0, this.geometry.vertices.length);

};

/*
 * @author Danielhu229 http://hustdanielhu.com
 */

CanvasToy.Renderer = function (canvas) {

    this.canvasDom = canvas || document.createElement('canvas');

    this.programs = [];
    this.webglContext = initWebwebglContext(canvas);

    this.initMatrix();

    var vertexShader = compileShader(this.webglContext, 'shader-vs');
    var fragmentShader = compileShader(this.webglContext, 'shader-fs');

    this.webglContext.clearColor(0.0, 0.0, 0.0, 1.0);
    this.webglContext.clearDepth(1.0);
    this.webglContext.enable(this.webglContext.DEPTH_TEST);
    this.webglContext.depthFunc(this.webglContext.LEQUAL);
};

CanvasToy.Renderer.prototype.render = function (scene, camera) {
    this.webglContext.clear(this.webglContext.COLOR_BUFFER_BIT | this.webglContext.DEPTH_BUFFER_BIT);
    scene.renderObjects.forEach(function(object){
        object.draw(camera);
    });

    //TODO: implements function
};

CanvasToy.Renderer.prototype.initMatrix = function () {
    glMatrix.setMatrixArrayType(Float32Array);
};
/*
 * @author Danielhu229 http://hustdanielhu.com
 */

CanvasToy.Scene = function() {
    this.renderObjects = [];
};

CanvasToy.Scene.prototype = Object.create(RenderNode);
CanvasToy.Scene.prototype.constructor = RenderNode;

CanvasToy.Scene.prototype.draw = function (camera){
    CanvasToy.RenderNode.draw.call(this, camera);
};

CanvasToy.Scene.prototype.addChild = function (child) {
    CanvasToy.RenderNode.addChild.call(this, child);
    this.renderObjects.push(child);
};
/*
 * @author Danielhu229 http://hustdanielhu.com
 */

CanvasToy.CubeGeometry = function () {
    Geometry.call(this);
    this.vertices = [
        1.0,  1.0,  0.0,
        -1.0, 1.0,  0.0,
        1.0,  -1.0, 0.0,
        -1.0, -1.0, 0.0
    ];
    this.initBuffers();
};

CanvasToy.CubeGeometry.prototype = Object.create(CanvasToy.Geometry.prototype);
CanvasToy.CubeGeometry.prototype.constructor = CanvasToy.CubeGeometry;

/*
 * @author Danielhu229 http://hustdanielhu.com
 */

CanvasToy.Geometry = function (vertices) {

    CanvasToy.RenderNode.call(this);
    this.vertices = [];

};

CanvasToy.Geometry.prototype.initBuffers = function() {
    //this.vertices = vertices || [];
    this.vertBuffer = this.webglContext.createBuffer();
    this.webglContext.bindBuffer(this.webglContext.ARRAY_BUFFER, this.vertBuffer);
};



/*
 * @author Danielhu229 http://hustdanielhu.com
 */

function initWebGL(canvas){
    var gl = null;
    try {
        gl = canvas.getContext('experimental-webgl');
    } catch(e) {
        gl = canvas.getContext('webgl');
    }
    if(!gl){
        alert("can't init webgl, current browser may not support it.");
    }
    return gl;
}

function compileShader(gl, id){
    var shaderScript = document.getElementById(id);

    if (!shaderScript) {
        return null;
    }

    var theSource = "";
    var currentChild = shaderScript.firstChild;

    while(currentChild) {
        if (currentChild.nodeType == 3) {
            theSource += currentChild.textContent;
        }

        currentChild = currentChild.nextSibling;
    }

  // Now figure out what type of shader script we have,
  // based on its MIME type.

    var shader;

    if (shaderScript.type == "x-shader/x-fragment") {
        shader = gl.createShader(gl.FRAGMENT_SHADER);
    } else if (shaderScript.type == "x-shader/x-vertex") {
        shader = gl.createShader(gl.VERTEX_SHADER);
    } else {
        alert(id+": unknown shader type");
        return null;  // Unknown shader type
    }

  // Send the source to the shader object

    gl.shaderSource(shader, theSource);

  // Compile the shader program

    gl.compileShader(shader);

  // See if it compiled successfully

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert("An error occurred compiling the shaders: " + gl.getShaderInfoLog(shader));
    return null;
  }

  return shader;
}

function getShaderProgram(gl, vertexShader, fragmentShader){
    shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);
    return shaderProgram;
}

function setProgram(camera, fog, material, object){
    //TODO: implement function
}

/*
 * @author Danielhu229 http://hustdanielhu.com
 */

CanvasToy.Material = function(name){
//TODO: implement constructor
};
/*
 * @author Danielhu229 http://hustdanielhu.com
 */
CanvasToy.Object3d = function(){
    this.webglContext = options.webglContext;
    this.modelViewMatrix = mat4.create();
    this.matrix = mat4.create();
    this.position = vec3.create();
    this.scale = vec3.create();
};

CanvasToy.Object3d.prototype.start = function () {

};

CanvasToy.Object3d.prototype.update = function(dt){

};

CanvasToy.Object3d.updateMatrices = function() {

};

CanvasToy.Object3d.prototype.tranlate = function (deltaX, deltaY, deltaZ) {
    this.modelViewMatrix = mat4.tranlate(mat4.create(), this.modelViewMatrix, new vec3(deltaX, deltaY, deltaZ));
};

CanvasToy.Object3d.prototype.tranlateTo = function(toX, toY, toZ){
    
};

CanvasToy.Object3d.prototype.scale = function (deltaX, deltaY, deltaZ) {
    this.modelViewMatrix = mat4.scale(mat4.create(), this.modelViewMatrix, new vec3(deltaX, deltaY, deltaZ));
};

CanvasToy.Object3d.prototype.rotate = function (axis, angle) {
    this.modelViewMatrix = mat4.rotate(mat4.create(), this.modelViewMatrix, new vec3(deltaX, deltaY, deltaZ));
};

CanvasToy.Object3d.prototype.rotate = function () {
    
};

/*
 * @author Danielhu229 http://hustdanielhu.com
 */
CanvasToy.RenderNode = function () {
    Object3d.call(this);
    this.relativeMatrix = mat4.create();
    this.children = [];
    this.parent = null;
};

CanvasToy.RenderNode.prototype = Object.create(CanvasToy.Object3d.prototype);
CanvasToy.RenderNode.prototype.constructor = CanvasToy.Object3d;

CanvasToy.RenderNode.prototype.addChild = function (child) {
    this.children.push(child);
    child.parent = this;
};

CanvasToy.RenderNode.prototype.updateMatrices = function () {
    var parentMatrix = this.parent.matrix;
    this.modelViewMatrix = mat4.mul(mat4.create(), this.relativeMatrix, parentMatrix);
    this.children.forEach(function(child){
        this.children[child].updateMatrices();
    });
};

CanvasToy.RenderNode.prototype.draw = function(camera){
    this.matrix = mat4.mul(mat4.create(), camera.projectionMatrix, this.modelViewMatrix);

};

