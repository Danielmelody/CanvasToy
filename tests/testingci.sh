#! /bin/sh

tsc -v
rm -rf build/
tsc
karma start karma.conf.js --browsers Firefox
