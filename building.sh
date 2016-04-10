#! /bin/sh
node glslLoader.js
tsc
grunt concat
grunt uglify
