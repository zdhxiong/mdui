const watch = require('node-watch');
const {
  traverseDirectory,
  buildLessFile,
  buildJsFile,
} = require('../utils.js');

const watchOptions = {
  recursive: true,
  filter: (filepath) => {
    if (filepath.indexOf('node_modules') > -1) {
      return false;
    }

    return /.(?:less)$/.test(filepath);
  },
};

traverseDirectory('./packages/components/src', (srcFilePath) => {
  if (srcFilePath.endsWith('ts')) {
    const filePath = srcFilePath
      .replace('/src/', '/')
      .replace('\\src\\', '\\')
      .replace('.ts', '.js');

    buildJsFile(filePath, false);
  }
});

traverseDirectory('./packages/components/src', (filePath) => {
  if (filePath.endsWith('less')) {
    buildLessFile(filePath, false);
  }
});

let updating = false;

watch('./packages/components/src', watchOptions, (_, filePath) => {
  if (updating) {
    return;
  }

  if (filePath.endsWith('less')) {
    updating = true;

    buildLessFile(filePath, false).finally(() => {
      updating = false;
    });
  }
});
