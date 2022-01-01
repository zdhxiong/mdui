const fs = require('fs');
const path = require('path');
const less = require('less');
const postcss = require('postcss');
const autoprefixer = require('autoprefixer');
const CleanCSS = require('clean-css');

const packagePath = './packages/mdui';
const srcPath = path.join(packagePath, 'src/styles');
const inputPath = path.join(srcPath, 'index.less');

const build = async () => {
  try {
    const lessInput = fs.readFileSync(inputPath).toString();
    const renderResult = await less.render(lessInput, {
      filename: inputPath,
    });
    const postcssResult = await postcss([autoprefixer]).process(
      renderResult.css,
      {
        from: undefined,
      },
    );
    const cssOutput = new CleanCSS().minify(postcssResult.css).styles;
    const outputName = path.resolve(packagePath, 'mdui.css');

    fs.writeFileSync(outputName, cssOutput);
  } catch (e) {
    console.log(e);
  }
};

build();
