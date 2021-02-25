const watch = require('node-watch');
const { buildLessDir, buildLessFile } = require('./utils')

const watchOptions = {
  recursive: true,
  filter: filepath => {
    if (filepath.indexOf('node_modules') > -1) {
      return false;
    }

    return /.(?:less)$/.test(filepath);
  }
}

buildLessDir('src', false);

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
