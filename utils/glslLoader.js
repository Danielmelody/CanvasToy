var fs = require('fs');

function read() {
    var srcs = fs.readdirSync('src/shader/sources');
    console.log("srcs:"+srcs);
    var results = ['module CanvasToy {'];
    for (var i in srcs) {
        var varName = srcs[i].split('.').join('_');
        var content = fs.readFileSync('src/shader/sources/'+ srcs[i], 'utf-8');
        content = content.split('\n');
        content = content.join('\\n');
        var out = 'export var '+ varName + ' = "' + content + '"';
        results.push(out);
    }
    results.push('}');
    var resultStr = results.join('\n');
    fs.writeFileSync('src/shader/shaders.ts', resultStr);
}
read();
