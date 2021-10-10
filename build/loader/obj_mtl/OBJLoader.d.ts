import { Object3d } from "../../Object3d";
export declare class OBJLoader {
    static load(gl: WebGLRenderingContext, url: string): Object3d;
    protected static faceSplitVertPattern: RegExp;
    protected static facePerVertPattern: RegExp;
    protected static objectSplitPattern: RegExp;
    protected static mtlLibPattern: RegExp;
    protected static useMTLPattern: RegExp;
    protected static mtlLibSinglePattern: RegExp;
    protected static useMTLSinglePattern: RegExp;
    protected static vertexPattern: RegExp;
    protected static uvPattern: RegExp;
    protected static normalPattern: RegExp;
    protected static indexPattern: RegExp;
    protected static praiseAttibuteLines(lines: any): number[][];
    protected static parseAsTriangle(faces: string[], forEachFace: (face: string[]) => void): void;
    protected static buildUpMeshes(gl: WebGLRenderingContext, container: Object3d, content: string, materials: any, unIndexedPositions: number[][], unIndexedUVs: number[][], unIndexedNormals: number[][]): void;
}
