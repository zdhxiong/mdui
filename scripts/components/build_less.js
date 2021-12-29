const { packagePath, traverseDirectory, buildLessFile } = require('./utils.js');

traverseDirectory(`${packagePath}/src`, (filePath) => {
  if (filePath.endsWith('less')) {
    buildLessFile(filePath, true);
  }
});
