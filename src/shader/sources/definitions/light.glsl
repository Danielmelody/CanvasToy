#ifdef OPEN_LIGHT // light declaration
struct Light {
    vec3 color;
    float idensity;
    vec3 position;
};

struct SpotLight {
    vec3 color;
    float idensity;
    vec3 direction;
    vec3 position;
};

#endif // light declaration
