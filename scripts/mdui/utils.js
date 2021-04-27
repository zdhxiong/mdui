const fs = require('fs');
const path = require('path');
const less = require('less');
const { ESLint } = require('eslint');
const postcss = require('postcss');
const autoprefixer = require('autoprefixer');
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

      return postcss([autoprefixer])
        .process(output.css, { from: undefined })
        .then((result) => result.css);
    })
    .then((output) => {
      const outputFilePath = filePath; //.replace(/src/, 'es');
      const outputDir = path.dirname(outputFilePath);
      try {
        fs.statSync(outputDir);
      } catch (err) {
        fs.mkdirSync(outputDir);
      }

      const isToJs = !outputDir.endsWith('styles');

      if (isToJs) {
        const outputName = path.resolve(
          outputFilePath.replace(/(less)$/, 'ts'),
        );
        const outputContent = `import {css} from 'lit';export const style = css\`${output}\`;`;
        fs.writeFileSync(outputName, outputContent);

        const eslint = new ESLint({ fix: true });
        eslint
          .lintFiles(outputName)
          .then((results) => ESLint.outputFixes(results));
      } else {
        const outputName = path.resolve(
          outputFilePath.replace(/(less)$/, 'css'),
        );
        fs.writeFileSync(outputName, output);
      }
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
    },
  });

  const outputName = path.resolve(filePath);

  if (result) {
    fs.writeFileSync(outputName, result.code);
  }
}

exports.packagePath = './packages/mdui';
exports.traverseDirectory = traverseDirectory;
exports.buildLessFile = buildLessFile;
exports.buildJsFile = buildJsFile;
