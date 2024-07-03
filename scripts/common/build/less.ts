import fs from 'node:fs';
import autoprefixer from 'autoprefixer';
import CleanCSS from 'clean-css';
import less from 'less';
// @ts-ignore
import NpmImportPlugin from 'less-plugin-npm-import';
import postcss from 'postcss';
import { getGlobalLessMixin, isDev } from './shared.js';

/**
 * less 文件构建
 * @param filePath less 文件路径
 * @param outputPath 输出的 css 文件路径
 */
export const buildLessFile = async (
  filePath: string,
  outputPath: string,
): Promise<void> => {
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
        .then((result) => new CleanCSS().minify(result.css).styles);
    })
    .then((result) => {
      fs.writeFileSync(outputPath, result);
    });
};
