#ifdef OPEN_LIGHT // light declaration

struct DirectLight
{
    vec3 color;
    float idensity;
    vec3 direction;

    int shadowIndex;
};

struct PointLight {
    vec3 color;
    float idensity;
    float radius;
    vec3 position;
    float squareAtten;
    float linearAtten;
    float constantAtten;

    int shadowIndex;
};

struct SpotLight {
    vec3 color;
    float idensity;
    float radius;
    vec3 position;
    float squareAtten;
    float linearAtten;
    float constantAtten;
    vec3 spotDir;
    float coneAngleCos;

    int shadowIndex;
};

#endif // light declaration
