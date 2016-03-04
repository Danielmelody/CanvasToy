module CanvasToy{
    /* auto generated shader string */
    export var common_vert  =
[
'attribute vec3 position;',
'uniform mat4 modelViewMatrix;',
'uniform mat4 projectionMatrix;',
'varying vec4 color;',
'void main (){',
'    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1);',
'}',
].join("\n");
 ;
    export var common_frag  =
[
'varying vec4 color;',
'void main (void){',
'    gl_FragColor = color;',
'}',
].join("\n");
 ;
}
