#ifdef OPEN_LIGHT // light declaration
struct PointLight {
    vec3 color;
    float idensity;
    float radius;
    vec3 position;
};

struct SpotLight {
    vec3 color;
    float idensity;
    float radius;
    vec3 position;
    vec3 direction;
};

#endif // light declaration
