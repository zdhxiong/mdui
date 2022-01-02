const { traverseDirectory, buildLitStyleFile } = require('../utils.js');

traverseDirectory('./packages/components/src', 'less', (filePath) => {
  buildLitStyleFile(filePath);
});
