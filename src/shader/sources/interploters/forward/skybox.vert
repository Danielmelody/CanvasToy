attribute vec3 position;
uniform mat4 viewProjectionMatrix;
varying vec3 cubeUV;

void main (){
    vec4 mvp = viewProjectionMatrix * vec4(position, 1.0);
    cubeUV = position;
    gl_Position = mvp.xyww;
}
