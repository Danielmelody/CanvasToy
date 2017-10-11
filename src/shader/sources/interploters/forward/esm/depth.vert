attribute vec3 position;
uniform mat4 modelViewProjectionMatrix;
uniform mat4 modelViewMatrix;
varying vec3 viewPos;

void main () {
    gl_Position = modelViewProjectionMatrix * vec4(position, 1.0);
    viewPos = (modelViewMatrix * vec4(position, 1.0)).xyz;
}
