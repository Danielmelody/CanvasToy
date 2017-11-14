struct DirectLight
{
    vec3 color;
    float idensity;
    vec3 direction;
#ifdef USE_SHADOW
    sampler2D shadowMap;
    float shadowMapSize;
    mat4 projectionMatrix;
    mat4 viewMatrix;
#endif
};

struct PointLight {
    vec3 color;
    float idensity;
    float radius;
    vec3 position;
    float squareAtten;
    float linearAtten;
    float constantAtten;
#ifdef USE_SHADOW
    sampler2D shadowMap;
    float shadowMapSize;
    mat4 projectionMatrix;
    mat4 viewMatrix;
    float pcssArea;
#endif
};

struct SpotLight {
    vec3 color;
    float idensity;
    float radius;
    vec3 position;
    float squareAtten;
    float linearAtten;
    float constantAtten;
    float coneAngleCos;
    vec3 spotDir;
#ifdef USE_SHADOW
    sampler2D shadowMap;
    float shadowMapSize;
    mat4 projectionMatrix;
    mat4 viewMatrix;
    float pcssArea;
#endif
};
