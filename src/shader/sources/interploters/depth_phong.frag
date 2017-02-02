uniform vec3 ambient;
uniform vec3 depthColor;

uniform float cameraNear;
uniform float cameraFar;

uniform sampler2D uMainTexture;
varying vec2 vMainUV;

float LinearizeDepth(float depth)
{
    float z = depth * 2.0 - 1.0; // Back to NDC
    return (2.0 * cameraNear * cameraFar) / (cameraFar + cameraNear - z * (cameraFar - cameraNear));
}

void main () {
    gl_FragColor = vec4(vec3(LinearizeDepth(texture2D(uMainTexture, vMainUV).r) / cameraFar), 1.0);
}
