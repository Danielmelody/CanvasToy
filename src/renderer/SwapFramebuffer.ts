import { FrameBuffer } from "./FrameBuffer";
export class ProcessingFrameBuffer {

    private _candidates: FrameBuffer[] = [];
    private _activeIndex: number = 0;
    private _gl;

    private _width;
    private _height;

    private _onInits: Array<(frameBuffer: FrameBuffer) => void> = [];

    constructor(gl: WebGLRenderingContext) {
        this._gl = gl;
    }

    public swap() {
        if (this._candidates.length === 1) {
            const fbo = new FrameBuffer(this._gl);
            fbo.setWidth(this._width).setHeight(this._height);
            this._onInits.forEach((inits) => { inits(fbo); });
            this._candidates.push(fbo);
        }
        this._activeIndex = 1 - this._activeIndex;
    }

    public get active() {
        if (this._candidates.length === 0) {
            const fbo = new FrameBuffer(this._gl);
            fbo.setWidth(this._width).setHeight(this._height);
            this._onInits.forEach((inits) => { inits(fbo); });
            fbo.attach(this._gl);
            this._candidates.push(fbo);
        }
        return this._candidates[this._activeIndex];
    }

    public onInit(callback: (frameBuffer: FrameBuffer) => void) {
        this._onInits.push(callback);
        return this;
    }

    public setWidth(_width: number) {
        this._width = _width;
        for (const fbo of this._candidates) {
            fbo.setWidth(_width);
        }
        return this;
    }

    public setHeight(_height: number) {
        this._height = _height;
        for (const fbo of this._candidates) {
            fbo.setHeight(_height);
        }
        return this;
    }

    public attach(gl: WebGLRenderingContext, drawBuffer?: WebGLDrawBuffers) {
        for (const fbo of this._candidates) {
            fbo.attach(gl, drawBuffer);
        }
    }

    public get width() {
        return this._width;
    }

    public get height() {
        return this._height;
    }
}
