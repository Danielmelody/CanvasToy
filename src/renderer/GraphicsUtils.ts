import { RENDER_PARAM_HOLDER } from "../Decorators";
import { Geometry } from "../geometries/Geometry";
import { Attribute } from "../shader/Attibute";
import { IRenderParamHolder } from "../shader/Program";

export namespace Graphics {

    enum ShaderType {
        VertexShader,
        FragmentShader,
    }

    export function getRenderParamHost(obj: any, logError: boolean = false) {
        const holder: IRenderParamHolder = obj[RENDER_PARAM_HOLDER];
        if (holder === undefined) {
            if (logError) {
                console.log(obj);
                throw new Error(`${obj} has no renderParam property`);
            } else {
                return undefined;
            }
        }
        holder.hostObject = obj;
        return holder;
    }

    export function copyDataToVertexBuffer(gl: WebGLRenderingContext, geometry: Geometry) {
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, geometry.faces.buffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,
                      new Uint16Array(geometry.faces.data), gl.STATIC_DRAW);
        for (const name in geometry.attributes) {
            const attribute: Attribute = geometry.attributes[name];
            if (attribute !== undefined) {
                gl.bindBuffer(gl.ARRAY_BUFFER, attribute.buffer);
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(attribute.data), gl.STATIC_DRAW);
            }
        }
    }

    export function logEnabledAttribute(gl: WebGLRenderingContext, program: WebGLProgram) {
        for (let i = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES) - 1; i >= 0; i--) {
            console.dir(gl.getActiveAttrib(program, i));
        }
    }

    export function logIfFrameBufferInvalid(
        gl: WebGLRenderingContext,
        frameBuffer: WebGLFramebuffer,
    ) {
        let valid = false;
        gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer);
        const status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
        switch (status) {
            case gl.FRAMEBUFFER_INCOMPLETE_ATTACHMENT:
                console.error(
                    `gl.FRAMEBUFFER_INCOMPLETE_ATTACHMENT: The attachment types are mismatched
                    or not all framebuffer attachment points are framebuffer attachment complete.`,
                );
                break;
            case gl.FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT:
                console.error(
                    `gl.FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT: There is no attachment.`,
                );
                break;
            case gl.FRAMEBUFFER_INCOMPLETE_DIMENSIONS:
                console.error(
                    `gl.FRAMEBUFFER_INCOMPLETE_DIMENSIONS: Height and width of the attachment are not the same.`,
                );
                break;
            case gl.FRAMEBUFFER_UNSUPPORTED:
                console.error(
                    `gl.FRAMEBUFFER_UNSUPPORTED: The format of the attachment is not supported,
                    or if depth and stencil attachments are not the same renderbuffer.`,
                );
                break;
            default:
                valid = true;
                break;
        }
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        return valid;
    }

    export function initWebwebglContext(canvas, debug?: boolean): WebGLRenderingContext {
        let gl;
        try {
            gl = canvas.getContext("experimental-webgl");
        } catch (e) {
            gl = canvas.getContext("webgl");
        }
        if (!gl) {
            alert("Cannot init webgl, current browser may not support it.");
        }
        return gl;
    }

    function createSeparatedShader(gl: WebGLRenderingContext, source: string, type: ShaderType): WebGLShader {

        let shader: WebGLShader;

        let typeInfo;

        if (type === ShaderType.FragmentShader) {
            shader = gl.createShader(gl.FRAGMENT_SHADER);
            typeInfo = "fragment shader";
        } else if (type === ShaderType.VertexShader) {
            shader = gl.createShader(gl.VERTEX_SHADER);
            typeInfo = "vertex shader";
        }
        gl.shaderSource(shader, source);

        // Compile the shader program

        gl.compileShader(shader);

        // See if it compiled successfully

        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.error("error: " + typeInfo + "\n" + gl.getShaderInfoLog(shader));
            console.error(source);
            return null;
        }

        return shader;
    }

    function linkShader(
        gl: WebGLRenderingContext,
        vertexShader: WebGLShader,
        fragmentShader: WebGLShader,
        vertexSource: string,
        fragmentSource: string,
    ): WebGLProgram {
        const shaderProgram = gl.createProgram();
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

    export function createEntileShader(
        gl: WebGLRenderingContext, vertexShaderSource: string,
        fragmentShaderSource: string,
    ): WebGLProgram {
        const vertShader = createSeparatedShader(gl, vertexShaderSource, ShaderType.VertexShader);
        const fragShader = createSeparatedShader(gl, fragmentShaderSource, ShaderType.FragmentShader);
        return linkShader(gl, vertShader, fragShader, vertexShaderSource, fragmentShaderSource);
    }
}
