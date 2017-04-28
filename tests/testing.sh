#! /bin/sh
echo 'testing: build..'
rm -rf build/
tsc
echo 'testing: run..'
karma start karma.conf.js --browsers Chrome
