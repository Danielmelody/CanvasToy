import { DataType } from "../DataTypeEnum";
var Attribute = (function () {
    function Attribute(gl, paramter) {
        this.size = 3;
        this.data = [];
        this.index = 0;
        this.stride = 0;
        this.buffer = null;
        this.gl = null;
        this.buffer = gl.createBuffer();
        this.gl = gl;
        for (var attributeInfo in paramter) {
            this[attributeInfo] = paramter[attributeInfo] ? paramter[attributeInfo] : this[attributeInfo];
        }
        switch (paramter.type) {
            case DataType.float:
                this.type = gl.FLOAT;
                break;
            case DataType.int:
                this.type = gl.INT;
                break;
            default: break;
        }
    }
    return Attribute;
}());
export { Attribute };
//# sourceMappingURL=Attibute.js.map