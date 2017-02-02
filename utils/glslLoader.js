var fs = require('fs');

var walkSync = function(dir, filelist) {
  var fs = fs || require('fs'), files = fs.readdirSync(dir);
  filelist = filelist || [];
  files.forEach(function(file) {
    if (fs.statSync(dir + '/' + file).isDirectory()) {
      filelist = walkSync(dir + '/' + file + '/', filelist);
    } else {
      filelist.push(dir + '/' + file);
    }
  });
  return filelist;
};

function read() {
  var srcs = walkSync('src/shader/sources');
  var results = [ 'module CanvasToy {' ];
  for (let i in srcs) {
    var varName = srcs[i].replace(/[\/|\.]/g, '_');
    varName = varName.replace('src_shader_sources_', '');
    var content = fs.readFileSync(srcs[i], 'utf-8');
    content = content.split('\n');
    content = content.join('\\n');
    var out = 'export const ' + varName + ' = "' + content + '"';
    results.push(out);
  }
  results.push('}');
  var resultStr = results.join('\n');
  fs.writeFileSync('src/shader/shaders.ts', resultStr);
}
read();
