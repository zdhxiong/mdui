import fs from 'node:fs';
import { defaultMinifyOptions, minifyHTMLLiterals } from 'minify-html-literals';
import { traverseDirectory, isDev } from './shared.js';

/**
 * lit 组件生成 js 文件后，进行构建
 * @param filePath js 文件路径
 */
export const buildLitJsFile = (filePath: string): void => {
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

  if (result) {
    fs.writeFileSync(filePath, result.code);
  }
};

/**
 * 构建目录中所有 lit 组件生成的 js 文件
 * @param path 目录
 */
export const buildLitJsFiles = (path: string): void => {
  traverseDirectory(path, 'ts', (srcFilePath) => {
    const filePath = srcFilePath
      .replace('/src/', '/')
      .replace('\\src\\', '\\')
      .replace('.ts', '.js');

    buildLitJsFile(filePath);
  });
};
