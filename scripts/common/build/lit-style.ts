import fs from 'node:fs';
import path from 'node:path';
import autoprefixer from 'autoprefixer';
import { ESLint } from 'eslint';
import less from 'less';
// @ts-ignore
import NpmImportPlugin from 'less-plugin-npm-import';
import postcss from 'postcss';
import { getGlobalLessMixin, traverseDirectory, isDev } from './shared.js';

/**
 * lit 的 style.less 文件构建成 style.ts 文件
 * @param filePath less 文件路径
 */
export const buildLitStyleFile = async (filePath: string): Promise<void> => {
  const lessInput = getGlobalLessMixin() + fs.readFileSync(filePath).toString();

  return less
    .render(lessInput, {
      filename: filePath,
      plugins: [new NpmImportPlugin({ prefix: '~' })],
    })
    .then((result) => {
      if (isDev) {
        return result.css;
      }

      return postcss([autoprefixer])
        .process(result.css, {
          from: undefined,
        })
        .then((result) => result.css);
    })
    .then((result) => {
      const outputName = filePath.replace(/(less)$/, 'ts');
      const moduleName = path
        .basename(filePath, '.less')
        .replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
      const outputContent = `import {css} from 'lit';export const ${moduleName} = css\`${result}\`;`;
      fs.writeFileSync(outputName, outputContent);

      const eslint = new ESLint({ fix: true });
      return eslint.lintFiles(outputName);
    })
    .then((result) => {
      ESLint.outputFixes(result);
    });
};

/**
 * 把目录中所有的 lit 的 style.less 文件，构建成 style.ts 文件
 * @param path 目录
 */
export const buildLitStyleFiles = (path: string): void => {
  traverseDirectory(path, 'less', async (filePath) => {
    await buildLitStyleFile(filePath);
  });
};
