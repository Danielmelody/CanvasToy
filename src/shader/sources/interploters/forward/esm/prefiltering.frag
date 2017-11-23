uniform sampler2D uOrigin;
uniform vec2 uBlurDir;
uniform float uBlurStep;

uniform float lightArea;

varying vec2 uv;

void main () {
    float base = texture2D(uOrigin, uv).r;
    float block = 0.0;

    for (int i = 0; i < BLOCK_SIZE; ++i) {
        for (int j = 0; j < BLOCK_SIZE; ++j) {
            float d = texture2D(uOrigin, uv + vec2(float(i - BLOCK_SIZE / 2) + 0.5, float(j - BLOCK_SIZE / 2) + 0.5) * uBlurStep).r;
            block += step(base, d) * d / float(BLOCK_SIZE * BLOCK_SIZE);
        }
    }
    
    float kenelSize = min(4.0, lightArea * (base - block) / base);
    float stepSize = kenelSize / float(FILTER_SIZE);

    float sum = 0.0;

    for (int i = 0; i < FILTER_SIZE; ++i) {
        for (int j = 0; j < FILTER_SIZE; ++j) {
            float d = texture2D(uOrigin, 
            uv + stepSize * vec2(float(i - FILTER_SIZE / 2) + 0.5, float(j - FILTER_SIZE / 2) + 0.5) * uBlurStep).r;
            sum += exp(d - base) / float(FILTER_SIZE * FILTER_SIZE);
        }
    }

    float average = log(sum) + base;

    gl_FragColor.r = average;
    gl_FragColor.g = kenelSize;
}
