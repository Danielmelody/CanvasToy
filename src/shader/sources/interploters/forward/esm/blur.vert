uniform mat4 normalMatrix;
attribute vec3 position;
attribute vec3 normal;
varying vec4 vProjPos;
varying vec3 vNormal;

void main () {
    gl_Position = vProjPos = vec4(position, 1.0);
    vNormal = normalize((normalMatrix * vec4(normal, 1.0)).xyz);
}
