export function fetchRes(url) {
    return new Promise(function (resolve, reject) {
        var request = new XMLHttpRequest();
        request.onreadystatechange = function () {
            if (request.readyState === 4 && request.status === 200) {
                resolve(request.responseText);
            }
        };
        request.open("GET", url);
        request.send();
    });
}
//# sourceMappingURL=ResourceFetcher.js.map