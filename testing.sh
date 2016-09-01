#! /bin/sh
python -m SimpleHTTPServer 8000 &
open http://0.0.0.0:8000/tests/functional/$1
