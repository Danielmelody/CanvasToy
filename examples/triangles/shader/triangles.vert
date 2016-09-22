#define S 5.0
#define d_edge 0.001
#define d_search 0.001

attribute vec3 position;
attribute vec2 aMainUV;
attribute vec2 triangleUV1;
attribute vec2 triangleUV2;
varying vec4 triangleColor;
uniform sampler2D uMainTexture;

mat3 gx = mat3(1.0, 2.0, 1.0, 0.0, 0.0, 0.0, -1.0, -2.0, -1.0 );
mat3 gy = mat3(1.0, 0.0, -1.0, 2.0, 0.0, -2.0, 1.0, 0.0, -1.0);

float getGradient(vec2 uvPos) {
    mat3 I;
    for (float i = 0.0; i < 3.0; i++) {
		for (float j= 0.0; j<3.0; j++) {
            I[int(i)][int(j)] = length(texture2D( uMainTexture, uvPos + d_edge * vec2(i, j)).rgb);
		}
    }
    float dpx3 = dot(gx[0], I[0]) + dot(gx[1], I[1]) + dot(gx[2], I[2]);
    float dpy3 = dot(gy[0], I[0]) + dot(gy[1], I[1]) + dot(gy[2], I[2]);
    float x = dpx3 * dpx3;
    float y = dpy3 * dpy3;
    return dpx3 * dpx3 + dpy3 * dpy3;
}

vec2 getCloseEdgePos(vec2 uv) {
    vec2 edge = vec2(0.0, 0.0);
    float maxl = 0.0;
    for (float i = 0.0; i < S; ++i) {
        for (float j = 0.0; j < S; ++j) {
            vec2 uvPos = vec2(i - S / 2.0, j - S / 2.0) * d_search;
            float l = getGradient(uv + uvPos);
            if(l > maxl) {
                edge = uvPos;
            }
            maxl = max(l, maxl);
        }
    }
    return edge + uv;
}

void main () {
    vec2 fixedUV = getCloseEdgePos(aMainUV);
    vec2 fixedUV1 = getCloseEdgePos(triangleUV1);
    vec2 fixedUV2 = getCloseEdgePos(triangleUV2);
    /*float offset0 = length(aMainUV - fixedUV);
    float offset1 = length(triangleUV1 - fixedUV1);
    float offset2 = length(triangleUV2 - fixedUV2);*/

    //vec4 p1 = texture2D(uMainTexture, fixedUV) ;//* step(offset0, max(offset1, offset2));
    //vec4 p2 = texture2D(uMainTexture, fixedUV1) ;//* step(offset1, max(offset0, offset2));
    //vec4 p3 = texture2D(uMainTexture, fixedUV2) ;//* step(offset2, max(offset0, offset1));
    gl_Position = vec4(fixedUV * 2.0 - 1.0, 0.0, 1.0);
    // gl_Position = vec4(position, 1.0);
    triangleColor = texture2D(uMainTexture, (fixedUV + fixedUV1 + fixedUV2) / 3.0);
}
