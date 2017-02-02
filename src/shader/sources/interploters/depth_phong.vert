attribute vec3 position;
uniform mat4 modelViewProjectionMatrix;
attribute vec2 aMainUV;
varying vec2 vMainUV;

void main (){
    gl_Position = modelViewProjectionMatrix * vec4(position, 1.0);
    vMainUV = aMainUV;
}
