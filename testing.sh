#! /bin/sh
node glslLoader.js
tsc
grunt concat
grunt uglify
open test/index.html
