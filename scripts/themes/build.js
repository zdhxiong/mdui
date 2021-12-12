const fs = require('fs');
const path = require('path');
const less = require('less');
const postcss = require('postcss');
const autoprefixer = require('autoprefixer');
const CleanCSS = require('clean-css');

const packagePath = './packages/themes';
const srcPath = path.join(packagePath, 'src');

fs.readdirSync(srcPath).forEach(async (item) => {
  const inputPath = path.join(srcPath, item, 'index.less');

  if (!fs.existsSync(inputPath)) {
    return;
  }

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
  const outputName = path.resolve(packagePath, item) + '.css';

  fs.writeFileSync(outputName, cssOutput);
});
