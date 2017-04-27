// console.error(window.__karma__.files);
// Get a list of all the test files to include
//
// Get a list of all the test files to include
//
var allTestFiles = [];

// console.error(Object.keys(window.__karma__.files));
Object.keys(window.__karma__.files).forEach(function(file) {
  if (/.+\-Test\.js/.test(file)) {
    // Normalize paths to RequireJS module names.
    // If you require sub-dependencies of test files to be loaded as-is
    // (requiring file extension)
    // then do not normalize the paths
    allTestFiles.push(file);
  }
});

require.config({
  // Karma serves files under /base, which is the basePath from your config file

  paths : {"gl-matrix" : "base/build/node_modules/gl-matrix/dist/gl-matrix"},
  // dynamically load all test files
  deps : allTestFiles,

  // we have to kickoff jasmine, as it is asynchronous
  callback : window.__karma__.start
})
