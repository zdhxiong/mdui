const watch = require('node-watch');
const { buildLessFile } = require('../utils.js');

const watchOptions = {
  recursive: true,
  filter: (filepath) => {
    if (filepath.indexOf('node_modules') > -1) {
      return false;
    }

    return /.(?:less)$/.test(filepath);
  },
};

buildLessFile('./packages/icons/src/style.less', false);

let updating = false;

watch('./packages/icons/src', watchOptions, (_, filePath) => {
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
