const { packagePath, traverseDirectory, buildLessFile } = require('./utils');

traverseDirectory(`${packagePath}/src`, (filePath) => {
  if (filePath.endsWith('less')) {
    buildLessFile(filePath, true);
  }
});
