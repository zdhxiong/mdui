const fs = require('fs');
const path = require('path');
const less = require('less');
const watch = require('node-watch');
const postcss = require('postcss');
const autoprefixer = require('autoprefixer');

const watchOptions = {
  recursive: true,
  filter: (filepath) => {
    if (filepath.indexOf('node_modules') > -1) {
      return false;
    }

    return /.(?:less)$/.test(filepath);
  },
};

let updating = false;

watch('./packages/mdui/src/styles', watchOptions, async (_, filePath) => {
  if (updating) {
    return;
  }

  if (filePath.endsWith('less')) {
    updating = true;

    try {
      const lessInput = fs.readFileSync(filePath).toString();
      const renderResult = await less.render(lessInput, {
        filename: filePath,
      });
      const postcssResult = await postcss([autoprefixer]).process(
        renderResult.css,
        {
          from: undefined,
        },
      );
      const outputName = path.resolve('./packages/mdui', 'mdui.css');

      fs.writeFileSync(outputName, postcssResult.css);
      updating = false;
    } catch (e) {
      console.log(e);
      updating = false;
    }
  }
});
