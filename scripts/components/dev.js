const watch = require('node-watch');
const {
  packagePath,
  traverseDirectory,
  buildLessFile,
  buildJsFile,
} = require('./utils');

const watchOptions = {
  recursive: true,
  filter: (filepath) => {
    if (filepath.indexOf('node_modules') > -1) {
      return false;
    }

    return /.(?:less)$/.test(filepath);
  },
};

traverseDirectory(`${packagePath}/src`, (srcFilePath) => {
  if (srcFilePath.endsWith('ts')) {
    const filePath = srcFilePath
      .replace('/src/', '/')
      .replace('\\src\\', '\\')
      .replace('.ts', '.js');

    buildJsFile(filePath, false);
  }
});

traverseDirectory(`${packagePath}/src`, (filePath) => {
  if (filePath.endsWith('less')) {
    buildLessFile(filePath, false);
  }
});

let updating = false;

watch(`${packagePath}/src`, watchOptions, (_, filePath) => {
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
