attribute vec3 position;
uniform mat4 modelViewProjectionMatrix;

#ifdef USE_TEXTURE // texture
attribute vec2 aMainUV;
varying vec2 vMainUV;
#endif // texture

#ifdef OPEN_LIGHT // light
struct Light {
    vec3 specular;
    vec3 diffuse;
    float idensity;
    vec4 position;
    bool directional;
}; // light

uniform vec3 ambient;
uniform vec4 eyePos;
uniform mat4 normalMatrix;
attribute vec3 aNormal;
varying vec3 vLightColor;
vec3 totalLighting;
uniform Light lights[LIGHT_NUM];
#endif

void main (){
    gl_Position = modelViewProjectionMatrix * vec4(position, 1.0);
#ifdef OPEN_LIGHT
    vec3 normal = (normalMatrix * vec4(aNormal, 0.0)).xyz;
    totalLighting = ambient;
    normal = normalize(normal);
    for (int index = 0; index < LIGHT_NUM; index++) {
        totalLighting += calculate_light(gl_Position, normal, lights[index].position, eyePos, lights[index].specular, lights[index].diffuse, 4, lights[index].idensity);
    }
    vLightColor = totalLighting;
#endif
#ifdef USE_TEXTURE
    vTextureCoord = aTextureCoord;
#endif
}
