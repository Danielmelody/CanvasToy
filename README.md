# CanvasToy.js

![](https://travis-ci.org/Danielhu229/CanvasToy.svg?branch=master) [![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)


Lightweight WebGL/WenGL2 rendering engine

### roadmap before 1.0:

#### About advanced rendering:
+ [x] Both TBDR(Tile Based Deferred Rendering) and Common Forward Rendering pipeline
+ [ ] BRDF distribution via StandardMaterial
+ [ ] Fully WebGL2 support.
+ [ ] Read and display .gltf files

#### About basic rendering:
+ Lights
    * [x] Point lights
    * [x] Directional lights
    * [x] Spot lights
+ Shadow
    * [*] Basic shadow mapping
    * [ ] Expotional soft shadow mapping (forward approach)
    * [ ] Expotional soft shadow mapping (deferred approach)
    * [ ] Percentage closer soft shadow
    * [ ] Screen-space shadow mapping (deferred approach)
+ Transforms
    * [x] Basic object transforms
    * [x] Bones system
    * [ ] Animation Parsing
+ Texture mappings
    * [x] Diffuse texture
    * [x] Normal texture
    * [x] Skybox via cube texture
    * [ ]  Noise texture && generation
    * [ ]  LightMap baking
+ [x] Render *color, depth, stencil* component to texture
+ [x] Reflection && refraction support

#### About models parsing
Planning filetypes:
+ [x]  .obj .mtl
+ [ ]  .fbx
+ [ ]  .blend (not sure)
+ [ ]  .max (not sure)

#### About network:
+ [x]  Automatically handle async resources loading,  including models, images and videos. You don't need to write some code like *image.onload = ...*

#### About Engineering
+ [ ]  More than 95% test cover
+ [x]  Using github workflow
+ [ ]  Build && test using pure node.js and typescript compiler, without gulp or grunt, webpack and bash , etc.
+ [x]  Generate a typescript declaration file .d.ts to support both javascript and typescript.

### Contribute:

See [CONTRIBUTING.md](CONTRIBUTING.md).

##  License

The MIT license.
