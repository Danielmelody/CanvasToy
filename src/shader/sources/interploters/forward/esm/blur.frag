uniform sampler2D uOrigin;
uniform vec2 uBlurDir;
uniform float uBlurStep;

uniform float lightArea;

#define MAX_BLOCK_SAMPLE 8.0
#define MAX_PCF_SAMPLE 8.0

uniform float blockSamples;
uniform float PCFSamples;

varying vec4 vProjPos;
varying vec3 vNormal;

void main () {
    vec2 uv = vProjPos.xy * 0.5 + 0.5;
    float base = texture2D(uOrigin, uv).r;
    float block = 0.0;
    gl_FragColor.r = base;

    for (float i = 0.0; i < MAX_BLOCK_SAMPLE; ++i) {
        if(i >= blockSamples) {
            break;
        }
        float d = texture2D(uOrigin, uv + (i - blockSamples / 2.0) * uBlurStep * uBlurDir).r;
        block += step(base, d) * d / blockSamples;
    }
    
    float kenelSize = lightArea * (base - block) / base;

    float sum = 0.0;

    for (float i = 0.0; i < MAX_PCF_SAMPLE; ++i) {
        if(i >= PCFSamples) {
            break;
        }
        float expd = exp(texture2D(uOrigin, uv + (i - PCFSamples / 2.0) * kenelSize * uBlurStep * uBlurDir).r - base);
        sum += expd / PCFSamples;
    }

    float average = log(sum) + base;

    gl_FragColor.r += average;
}
