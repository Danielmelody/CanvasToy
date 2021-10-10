export declare class MTLLoader {
    static load(gl: WebGLRenderingContext, baseurl: string): Promise<{}>;
    protected static newmtlPattern: RegExp;
    protected static ambientPattern: RegExp;
    protected static diffusePattern: RegExp;
    protected static specularePattern: RegExp;
    protected static specularExponentPattern: RegExp;
    protected static metallicPattern: RegExp;
    protected static roughnessPattern: RegExp;
    protected static mapPattern: RegExp;
    protected static mapSinglePattern: RegExp;
    private static handleSingleLine;
    private static getImageUrl;
    private static getVector;
    private static getNumber;
}
