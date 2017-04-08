uniform vec3 ambient;
uniform vec3 depthColor;

uniform float cameraNear;
uniform float cameraFar;

void main () {
    // float originDepth = 1.0 - (1.0 - gl_FragCoord.z) * 25.0;
    //
    // float linearDepth = linearlizeDepth(cameraFar, cameraNear, originDepth);
    // gl_FragColor = vec4(vec3(linearDepth), 1.0);
    // gl_FragColor = vec4(1.0);
}
