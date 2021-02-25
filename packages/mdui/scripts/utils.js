const less = require('less');
const fs = require('fs');
const path = require('path');
const postcss = require('postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');

function buildLessFile(filePath, optimization = true) {
  const lessInput = fs.readFileSync(filePath).toString()
  const lessOptions = { filename: path.resolve(filePath) };

  return less
    .render(lessInput, lessOptions)
    .then(output => {
      if (!optimization) {
        return output.css;
      }

      return postcss([ autoprefixer, cssnano ])
        .process(output.css, { from: undefined })
        .then(result => result.css);
    })
    .then(output => {
      const outputFilePath = filePath.replace(/^(src)/, 'es');
      const outputDir = path.dirname(outputFilePath);
      try {
        fs.statSync(outputDir);
      } catch (err) {
        fs.mkdirSync(outputDir)
      }

      const isToJs = !outputDir.endsWith('styles');
      const outputName = path.resolve(outputFilePath.replace(/(less)$/, isToJs ? 'js' : 'css'));
      const outputContent = isToJs ? `import {css} from 'lit-element';export default css\`${output}\`` : output;

      fs.writeFileSync(outputName, outputContent);
    })
    .catch(err => {
      console.log(err);
    })
}

function buildLessDir(dir, optimization = true) {
  const arr = fs.readdirSync(dir);

  arr.forEach(item => {
    const filePath = path.join(dir, item);

    if (fs.statSync(filePath).isDirectory()) {
      buildLessDir(filePath, optimization);
    } else if (filePath.endsWith('less')) {
      buildLessFile(filePath, optimization);
    }
  });
}

exports.buildLessFile = buildLessFile;
exports.buildLessDir = buildLessDir;
