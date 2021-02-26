const { traverseDirectory, buildLessFile, buildJsFile } = require('./utils');

traverseDirectory('es', filePath => {
  if (filePath.endsWith('js')) {
    buildJsFile(filePath, true);
  }
})

traverseDirectory('src', filePath => {
  if (filePath.endsWith('less')) {
    buildLessFile(filePath, true);
  }
})
