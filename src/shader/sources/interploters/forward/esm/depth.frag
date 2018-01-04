uniform float softness;
varying vec3 viewPos;

void main () {
    float d = length(viewPos);
    gl_FragColor.r = d * softness;
    gl_FragColor.g = exp(d) * d;
}
