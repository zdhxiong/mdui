const fs = require('fs');
const path = require('path');
const less = require('less');
const postcss = require('postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const {
  minifyHTMLLiterals,
  defaultMinifyOptions,
} = require('minify-html-literals');

function traverseDirectory(dir, callback) {
  const arr = fs.readdirSync(dir);

  arr.forEach((item) => {
    const filePath = path.join(dir, item);

    if (fs.statSync(filePath).isDirectory()) {
      traverseDirectory(filePath, callback);
    } else {
      callback(filePath);
    }
  });
}

function buildLessFile(filePath, optimization = true) {
  const lessInput = fs.readFileSync(filePath).toString();
  const lessOptions = { filename: path.resolve(filePath) };

  return less
    .render(lessInput, lessOptions)
    .then((output) => {
      if (!optimization) {
        return output.css;
      }

      return postcss([autoprefixer, cssnano])
        .process(output.css, { from: undefined })
        .then((result) => result.css);
    })
    .then((output) => {
      const outputFilePath = filePath.replace(/^(src)/, 'es');
      const outputDir = path.dirname(outputFilePath);
      try {
        fs.statSync(outputDir);
      } catch (err) {
        fs.mkdirSync(outputDir);
      }

      const isToJs = !outputDir.endsWith('styles');
      const outputName = path.resolve(
        outputFilePath.replace(/(less)$/, isToJs ? 'js' : 'css'),
      );
      const outputContent = isToJs
        ? `import {css} from 'lit-element';export default css\`${output}\``
        : output;

      fs.writeFileSync(outputName, outputContent);
    })
    .catch((err) => {
      console.log(err);
    });
}

function buildJsFile(filePath, optimization = true) {
  if (!optimization) {
    return;
  }

  const jsInput = fs.readFileSync(filePath).toString();

  const result = minifyHTMLLiterals(jsInput, {
    fileName: 'render.js',
    minifyOptions: {
      ...defaultMinifyOptions,
      minifyCSS: false,
    },
    shouldMinifyCSS: () => false,
  });

  const outputName = path.resolve(filePath);

  if (result) {
    fs.writeFileSync(outputName, result.code);
  }
}

exports.traverseDirectory = traverseDirectory;
exports.buildLessFile = buildLessFile;
exports.buildJsFile = buildJsFile;
