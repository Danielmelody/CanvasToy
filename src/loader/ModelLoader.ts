/// <reference path="../geometries/Geometry.ts"/>
/// <reference path="../materials/Material.ts"/>
 module CanvasToy {
     export class ModelLoader{


         private static fetch(url:string, onload:(content:string) => void) {
             var request = new XMLHttpRequest();
             request.onreadystatechange = () => {
                 if (request.readyState == 4 && request.status == 200) {
                     if (onload) {
                         onload(request.responseText);
                     }
                 }
             };
             request.open('GET', url);
             request.send();
         }
         public static loadObj(url:string, onload:() => void) : Geometry{
             //var lineRegular:RegExp = new RegExp('.+\n');
             var numberRegular:RegExp = new RegExp('^(-?\d+)(\.\d+)?$')
             var positionRegular:RegExp = new RegExp('v.+');
             var uvRegular:RegExp = new RegExp('vt.+');
             ModelLoader.fetch(url, (content:string) => {
                 var geometry:Geometry = new Geometry();
                 var lines:Array<string>;
                 var positions:Array<string>;
                 var uvs:Array<string>;
                 var normals:Array<string>;
                 lines = content.split('\n');
                 for (let line of lines) {
                     if (line.match(positionRegular)) {
                         positions.push(line);
                     }
                     if (line.match(uvRegular)) {
                         uvs.push(line);
                     }
                 }
                 // the amount of uvs and normals must match the amount of vertices
                 if (uvs.length > 0 && positions.length != uvs.length) {
                     console.error('obj file format error!');
                     return null;
                 }




             });





         }

     }
 }
