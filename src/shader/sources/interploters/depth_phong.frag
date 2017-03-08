uniform vec3 ambient;
uniform vec3 depthColor;

uniform float cameraNear;
uniform float cameraFar;

uniform sampler2D uMainTexture;
varying vec2 vMainUV;

void main () {
    float originDepth = texture2D(uMainTexture, vMainUV).r;
    float linearDepth = linearlizeDepth(cameraFar, cameraNear, originDepth) / cameraFar;
    gl_FragColor = vec4(vec3(originDepth * 2.0 - 1.0), 1.0);
}
