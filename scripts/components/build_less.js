const { traverseDirectory, buildLessFile } = require('../utils.js');

traverseDirectory('./packages/components/src', (filePath) => {
  if (filePath.endsWith('less')) {
    buildLessFile(filePath, true);
  }
});
