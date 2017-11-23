uniform mat4 normalMatrix;
attribute vec3 position;
attribute vec3 normal;
varying vec2 uv;
varying vec3 vNormal;

void main () {
    gl_Position = vec4(position, 1.0);
    uv = gl_Position.xy * 0.5 + 0.5;
    vNormal = normalize((normalMatrix * vec4(normal, 1.0)).xyz);
}
