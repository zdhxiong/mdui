const fs = require('fs');
const path = require('path');
const less = require('less');
const { ESLint } = require('eslint');
const postcss = require('postcss');
const CleanCSS = require('clean-css');
const autoprefixer = require('autoprefixer');
const NpmImportPlugin = require('less-plugin-npm-import');
const {
  minifyHTMLLiterals,
  defaultMinifyOptions,
} = require('minify-html-literals');

// 是否是开发模式
const isDev = process.argv.slice(2)[0] === '--dev';

/**
 * 遍历文件夹中的文件
 * @param dir 文件夹路径
 * @param suffix 文件后缀
 * @param callback 回调函数，参数为文件路径
 */
function traverseDirectory(dir, suffix, callback) {
  const arr = fs.readdirSync(dir);

  arr.forEach((item) => {
    const filePath = path.join(dir, item);

    if (fs.statSync(filePath).isDirectory()) {
      traverseDirectory(filePath, suffix, callback);
    } else if (filePath.endsWith(suffix)) {
      callback(filePath);
    }
  });
}

/**
 * lit 的 style.less 文件构建成 style.ts 文件
 * @param filePath less 文件路径
 */
function buildLitStyleFile(filePath) {
  const lessInput = fs.readFileSync(filePath).toString();
  const lessOptions = {
    filename: path.resolve(filePath),
    plugins: [new NpmImportPlugin({ prefix: '~' })],
  };

  return less
    .render(lessInput, lessOptions)
    .then((output) => {
      if (isDev) {
        return output.css;
      }

      return postcss([autoprefixer])
        .process(output.css, { from: undefined })
        .then((result) => result.css);
    })
    .then((output) => {
      const outputName = path.resolve(filePath.replace(/(less)$/, 'ts'));
      const outputContent = `import {css} from 'lit';export const style = css\`${output}\`;`;
      fs.writeFileSync(outputName, outputContent);

      const eslint = new ESLint({ fix: true });
      eslint
        .lintFiles(outputName)
        .then((results) => ESLint.outputFixes(results));
    })
    .catch((err) => {
      console.log(err);
    });
}

/**
 * lit 组件生成 js 文件后，进行构建
 * @param filePath js 文件路径
 */
function buildJsFile(filePath) {
  if (isDev) {
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

/**
 * less 文件构建
 * @param filePath less 文件路径
 * @param outputPath 输出的 css 文件路径
 */
function buildLessFile(filePath, outputPath) {
  const lessInput = fs.readFileSync(filePath).toString();
  const lessOptions = {
    filename: path.resolve(filePath),
    plugins: [new NpmImportPlugin({ prefix: '~' })],
  };

  return less
    .render(lessInput, lessOptions)
    .then((output) => {
      if (isDev) {
        return output.css;
      }

      return postcss([autoprefixer])
        .process(output.css, { from: undefined })
        .then((result) => new CleanCSS().minify(result.css).styles);
    })
    .then((output) => {
      fs.writeFileSync(outputPath, output);
    })
    .catch((err) => {
      console.log(err);
    });
}

exports.traverseDirectory = traverseDirectory;
exports.buildLitStyleFile = buildLitStyleFile;
exports.buildJsFile = buildJsFile;
exports.buildLessFile = buildLessFile;
exports.isDev = isDev;
