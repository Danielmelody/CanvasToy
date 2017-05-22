vec4 packFloat1x32(float val)
{
    vec4 pack = vec4(1.0, 255.0, 65025.0, 16581375.0) * val;
    pack = fract(pack);
    pack -= vec4(pack.yzw / 255.0, 0.0);
    return pack;
}
