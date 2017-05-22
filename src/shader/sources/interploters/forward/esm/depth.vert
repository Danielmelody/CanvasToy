attribute vec3 position;
uniform mat4 modelViewProjectionMatrix;
varying vec4 vProjPos;

void main () {
    gl_Position = vProjPos = modelViewProjectionMatrix * vec4(position, 1.0);
}
