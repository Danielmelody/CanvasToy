/// <reference path="../../Object3d.ts"/>
/// <reference path="../../materials/Material.ts"/>
/// <reference path="../../geometries/Geometry.ts"/>
/// <reference path="../../Mesh.ts"/>

namespace CanvasToy {

    export function fetchRes(url: string) {
        return new Promise((resolve, reject) => {
            const request = new XMLHttpRequest();
            request.onreadystatechange = () => {
                if (request.readyState === 4 && request.status === 200) {
                    resolve(request.responseText);
                }
            };
            request.open("GET", url);
            request.send();
        });
    }
}
