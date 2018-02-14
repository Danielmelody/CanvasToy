# CanvasToy.js

![](https://travis-ci.org/Danielhu229/CanvasToy.svg?branch=master) [![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)


Lightweight WebGL/WenGL2 rendering engine, see some [examples](http://canvastoy.com/examples) here

### roadmap before 1.0:

+ PipeLine
    * [x] Forward Rendering
    * [x] Tile Based Deferred Rendering(TBDR)
+ Shading
    * [x] Physical-based(GGX) material model
    * [x] Image Based lighting (IBL)
    * [x] Traditional material model(blinn-phong)
    * [ ] Reflection and retracions
+ Load and Parsing
    * [x] .obj .mtl, 
    * [ ] .fbx
    * [ ] .gltf
    * [x] Variours types of images (through HTMLImageElement) as Textures
+ Lights
    * [x] Point lights
    * [x] Directional lights
    * [x] Spot lights
+ Shadows
    * [x] Basic shadow mapping
    * [x] Expotional soft shadow mapping (forward approach)
    * [ ] Expotional soft shadow mapping (deferred approach)
    * [x] Percentage closer soft shadow(PCSS)
    * [ ] Screen-space shadow mapping (deferred approach)
+ Transforms
    * [x] Basic object transforms
    * [x] Scenes Graph
    * [ ] Bones and Animation Parsing
+ Engineering
    + [ ]  More than 95% test cover
    * [x]  Automatically handle async resources loading,  including models, images and videos. You don't need to write some code like *image.onload = ...*
    * [x]  Using github workflow
    * [x]  Build && test using pure node.js scripts and typescript compiler, without gulp or grunt, webpack and bash , etc.
    * [x]  Generate a typescript declaration file .d.ts to provide type hint.

### Contribute:

See [CONTRIBUTING.md](CONTRIBUTING.md).

##  License

The MIT license.
