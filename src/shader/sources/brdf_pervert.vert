attribute vec3 position;
uniform mat4 modelViewProjectionMatrix;

#ifdef USE_TEXTURE // texture
attribute vec2 aTextureCoord;
varying vec2 vTextureCoord;
#endif // texture

#ifdef OPEN_LIGHT // light
struct Light {
    vec3 specular;
    vec3 diffuse;
    float idensity;
    vec3 position;
    bool directional;
}; // light

uniform vec3 ambient;
uniform vec3 eyePosition;
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
        vec3 lightDir = normalize(lights[index].position - gl_Position.xyz);
        float lambortian = max(dot(lightDir, normal), 0.0);
        vec3 reflectDir = reflect(lightDir, normal);
        vec3 viewDir = normalize(eyePosition - gl_Position.xyz);
        float specularAngle = max(dot(reflectDir, viewDir), 0.0);
        float specular = pow(specularAngle, 16.0);
        vec3 specularColor = lights[index].specular * specular;
        vec3 diffuseColor = lights[index].diffuse * lambortian * lights[index].idensity;
        totalLighting = totalLighting + (diffuseColor + specularColor);
    }
    vLightColor = totalLighting;
#endif
#ifdef USE_TEXTURE
    vTextureCoord = aTextureCoord;
#endif
}
