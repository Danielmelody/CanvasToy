attribute vec3 position;

varying vec4 vProjPos;

void main () {
    gl_Position = vProjPos = vec4(position, 1.0);
}
