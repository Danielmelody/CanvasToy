import { RENDER_PARAM_HOLDER } from "../Decorators";
export var Graphics;
(function (Graphics) {
    var ShaderType;
    (function (ShaderType) {
        ShaderType[ShaderType["VertexShader"] = 0] = "VertexShader";
        ShaderType[ShaderType["FragmentShader"] = 1] = "FragmentShader";
    })(ShaderType || (ShaderType = {}));
    function getRenderParamHost(obj, logError) {
        if (logError === void 0) { logError = false; }
        var holder = obj[RENDER_PARAM_HOLDER];
        if (holder === undefined) {
            if (logError) {
                console.log(obj);
                throw new Error(obj + " has no renderParam property");
            }
            else {
                return undefined;
            }
        }
        holder.hostObject = obj;
        return holder;
    }
    Graphics.getRenderParamHost = getRenderParamHost;
    function copyDataToVertexBuffer(gl, geometry) {
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, geometry.faces.buffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(geometry.faces.data), gl.STATIC_DRAW);
        for (var name_1 in geometry.attributes) {
            var attribute = geometry.attributes[name_1];
            if (attribute !== undefined) {
                gl.bindBuffer(gl.ARRAY_BUFFER, attribute.buffer);
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(attribute.data), gl.STATIC_DRAW);
            }
        }
    }
    Graphics.copyDataToVertexBuffer = copyDataToVertexBuffer;
    function logEnabledAttribute(gl, program) {
        for (var i = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES) - 1; i >= 0; i--) {
            console.dir(gl.getActiveAttrib(program, i));
        }
    }
    Graphics.logEnabledAttribute = logEnabledAttribute;
    function logIfFrameBufferInvalid(gl, frameBuffer) {
        var valid = false;
        gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer);
        var status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
        switch (status) {
            case gl.FRAMEBUFFER_INCOMPLETE_ATTACHMENT:
                console.error("gl.FRAMEBUFFER_INCOMPLETE_ATTACHMENT: The attachment types are mismatched\n                    or not all framebuffer attachment points are framebuffer attachment complete.");
                break;
            case gl.FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT:
                console.error("gl.FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT: There is no attachment.");
                break;
            case gl.FRAMEBUFFER_INCOMPLETE_DIMENSIONS:
                console.error("gl.FRAMEBUFFER_INCOMPLETE_DIMENSIONS: Height and width of the attachment are not the same.");
                break;
            case gl.FRAMEBUFFER_UNSUPPORTED:
                console.error("gl.FRAMEBUFFER_UNSUPPORTED: The format of the attachment is not supported,\n                    or if depth and stencil attachments are not the same renderbuffer.");
                break;
            default:
                valid = true;
                break;
        }
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        return valid;
    }
    Graphics.logIfFrameBufferInvalid = logIfFrameBufferInvalid;
    function initWebwebglContext(canvas, debug) {
        var gl;
        try {
            gl = canvas.getContext("experimental-webgl");
        }
        catch (e) {
            gl = canvas.getContext("webgl");
        }
        if (!gl) {
            alert("Cannot init webgl, current browser may not support it.");
        }
        return gl;
    }
    Graphics.initWebwebglContext = initWebwebglContext;
    function createSeparatedShader(gl, source, type) {
        var shader;
        var typeInfo;
        if (type === ShaderType.FragmentShader) {
            shader = gl.createShader(gl.FRAGMENT_SHADER);
            typeInfo = "fragment shader";
        }
        else if (type === ShaderType.VertexShader) {
            shader = gl.createShader(gl.VERTEX_SHADER);
            typeInfo = "vertex shader";
        }
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.error("error: " + typeInfo + "\n" + gl.getShaderInfoLog(shader));
            console.error(source);
            return null;
        }
        return shader;
    }
    function linkShader(gl, vertexShader, fragmentShader, vertexSource, fragmentSource) {
        var shaderProgram = gl.createProgram();
        gl.attachShader(shaderProgram, vertexShader);
        gl.attachShader(shaderProgram, fragmentShader);
        gl.linkProgram(shaderProgram);
        if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
            console.error("error: link shader program failed.\n" + gl.getProgramInfoLog(shaderProgram));
            console.error("vertex:\n" + vertexSource);
            console.error("fragment:\n" + fragmentSource);
        }
        return shaderProgram;
    }
    function createEntileShader(gl, vertexShaderSource, fragmentShaderSource) {
        var vertShader = createSeparatedShader(gl, vertexShaderSource, ShaderType.VertexShader);
        var fragShader = createSeparatedShader(gl, fragmentShaderSource, ShaderType.FragmentShader);
        return linkShader(gl, vertShader, fragShader, vertexShaderSource, fragmentShaderSource);
    }
    Graphics.createEntileShader = createEntileShader;
})(Graphics || (Graphics = {}));
//# sourceMappingURL=GraphicsUtils.js.map