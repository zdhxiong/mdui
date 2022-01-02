const { traverseDirectory, buildJsFile } = require('../utils.js');

traverseDirectory('./packages/components/src', 'ts', (srcFilePath) => {
  const filePath = srcFilePath
    .replace('/src/', '/')
    .replace('\\src\\', '\\')
    .replace('.ts', '.js');

  buildJsFile(filePath);
});
