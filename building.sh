#! /bin/sh
echo building: convert shaders...
node utils/glslLoader.js || exit 1
echo building: compile codes...
rm -rf build
tsc || exit 1
cat build/canvas-toy-amd.d.ts > build/canvas-toy-amd-gen.d.ts
rm  build/canvas-toy-amd.d.ts
echo "/// <reference path='./canvas-toy-amd-gen.d.ts'/>" > build/canvas-toy-amd.d.ts
echo "export * from 'CanvasToy';" >> build/canvas-toy-amd.d.ts
echo "export as namespace CanvasToy;" >> build/canvas-toy-amd.d.ts
echo building: uglifying...
# uglifyjs build/canvas-toy.js -o build/canvas-toy-min.js
echo building: build examples...
cd examples
tsc || exit 1
echo 'building: done.'
