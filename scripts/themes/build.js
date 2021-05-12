const fs = require('fs');
const path = require('path');
const CleanCSS = require('clean-css');
const packagePath = './packages/themes';

fs.readdirSync(packagePath).forEach((item) => {
  const filePath = path.join(packagePath, item);

  if (!filePath.endsWith('less')) {
    return;
  }

  const lessInput = fs.readFileSync(filePath).toString();
  // @替换成--；删除//开头的注释
  const cssContent = `:root {
    ${lessInput.replace(/@/g, '--').replace(/\/\/.*?\n/g, '')}
  }`;
  const cssOutput = new CleanCSS().minify(cssContent).styles;
  const outputName = path.resolve(filePath.replace(/(less)$/, 'css'));

  fs.writeFileSync(outputName, cssOutput);
});
