#ifdef USE_COLOR // color declaration
uniform vec4 color;
#endif

#ifdef USE_TEXTURE // texture declaration
varying vec2 vMainUV;
uniform sampler2D uMainTexture;
vec4 textureColor;
#endif

#ifdef OPEN_LIGHT
struct Light {
    vec3 specular;
    vec3 diffuse;
    float idensity;
    vec3 position;
    bool directional;
};
varying vec3 vPosition;
varying vec3 vNormal;
uniform vec3 ambient;
uniform vec3 eyePos;
vec3 totalLighting;
uniform Light lights[LIGHT_NUM];
#endif

void main () {
    gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
#ifdef USE_COLOR
    gl_FragColor = color;
#endif

#ifdef USE_TEXTURE
    gl_FragColor = gl_FragColor * texture2D(uMainTexture, vMainUV);
#endif
#ifdef OPEN_LIGHT
    vec3 normal = normalize(vNormal);
    totalLighting = ambient;
    for (int index = 0; index < LIGHT_NUM; index++) {
        totalLighting += calculate_light(vPosition, normal, lights[index].position, eyePos, lights[index].specular, lights[index].diffuse, 4.0, lights[index].idensity);
    }
    gl_FragColor *= vec4(totalLighting, 1.0);
#endif
}
