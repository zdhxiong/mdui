const { packagePath, traverseDirectory, buildJsFile } = require('./utils.js');

traverseDirectory(`${packagePath}/src`, (srcFilePath) => {
  if (srcFilePath.endsWith('ts')) {
    const filePath = srcFilePath
      .replace('/src/', '/')
      .replace('\\src\\', '\\')
      .replace('.ts', '.js');

    buildJsFile(filePath, true);
  }
});
