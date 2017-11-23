uniform float softness;
varying vec3 viewPos;

void main () {
    gl_FragColor.r = -viewPos.z * softness;
    gl_FragColor.g = exp(-viewPos.z) * -viewPos.z;
}
