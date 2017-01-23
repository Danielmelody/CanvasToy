#ifdef OPEN_LIGHT // light declaration
struct Light {
    vec3 color;
    float idensity;
    vec4 position;
};

struct SpotLight {
    vec3 color;
    float idensity;
    vec4 position;
};

#endif // light declaration
