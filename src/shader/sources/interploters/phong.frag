uniform vec3 ambient;


uniform vec3 color;
uniform vec3 materialSpec;
uniform vec3 materialDiff;
uniform vec3 materialAmbient;

#ifdef OPEN_LIGHT
uniform vec4 eyePos;
varying vec3 vNormal;
varying vec4 vPosition;
#endif

#ifdef USE_TEXTURE
uniform sampler2D uMainTexture;
varying vec2 vMainUV;
#endif

uniform Light lights[LIGHT_NUM];
uniform SpotLight spotLights[LIGHT_NUM];

void main () {
    gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
#ifdef USE_COLOR
    gl_FragColor = vec4(color, 1.0);
#endif

#ifdef USE_TEXTURE
    gl_FragColor = gl_FragColor * texture2D(uMainTexture, vMainUV);
#endif
#ifdef OPEN_LIGHT
    vec3 normal = normalize(vNormal);
    vec3 totalLighting = ambient;
    for (int index = 0; index < LIGHT_NUM; index++) {
        totalLighting += calculate_light(
            vPosition,
            normal,
            lights[index].position,
            eyePos,
            materialSpec * lights[index].color,
            materialDiff * lights[index].color,
            4.0,
            lights[index].idensity
        );
    }
    gl_FragColor *= vec4(totalLighting, 1.0);
#endif
}
