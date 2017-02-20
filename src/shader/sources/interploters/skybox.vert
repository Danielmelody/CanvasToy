attribute vec3 position;
uniform mat4 modelViewProjectionMatrix;

varying vec3 cubeUV;

void main (){
    vec4 mvp = modelViewProjectionMatrix * vec4(position, 1.0);
    cubeUV = position;
    gl_Position = mvp.xyww;
}
