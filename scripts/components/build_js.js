const { traverseDirectory, buildJsFile } = require('../utils.js');

traverseDirectory('./packages/components/src', (srcFilePath) => {
  if (srcFilePath.endsWith('ts')) {
    const filePath = srcFilePath
      .replace('/src/', '/')
      .replace('\\src\\', '\\')
      .replace('.ts', '.js');

    buildJsFile(filePath, true);
  }
});
