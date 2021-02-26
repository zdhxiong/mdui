const watch = require('node-watch');
const { traverseDirectory, buildLessFile, buildJsFile } = require('./utils')

const watchOptions = {
  recursive: true,
  filter: filepath => {
    if (filepath.indexOf('node_modules') > -1) {
      return false;
    }

    return /.(?:less)$/.test(filepath);
  }
}

traverseDirectory('es', filePath => {
  if (filePath.endsWith('js')) {
    buildJsFile(filePath, false);
  }
})

traverseDirectory('src', filePath => {
  if (filePath.endsWith('less')) {
    buildLessFile(filePath, false);
  }
})

let updating = false;

watch('src', watchOptions, (_, filePath) => {
  if (updating) {
    return;
  }

  if (filePath.endsWith('less')) {
    updating = true;

    buildLessFile(filePath, false)
      .finally(() => {
        updating = false;
      })
  }
});
