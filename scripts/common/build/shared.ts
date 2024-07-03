import fs from 'node:fs';
import path from 'node:path';

/**
 * 是否是开发模式
 */
export const isDev = process.argv.slice(2)[0] === '--dev';

/**
 * 遍历文件夹中的文件
 * @param dir 文件夹路径
 * @param suffix 文件后缀
 * @param callback 回调函数，参数为文件路径
 */
export const traverseDirectory = (
  dir: string,
  suffix: string,
  callback: (path: string) => void,
): void => {
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const filePath = path.join(dir, file);

    if (fs.statSync(filePath).isDirectory()) {
      traverseDirectory(filePath, suffix, callback);
    } else if (filePath.endsWith(suffix)) {
      callback(filePath);
    }
  });
};

// 全局 mixin.less 文件内容
let globalLessMixin = '';
// 获取全局 mixin.less 文件内容
export const getGlobalLessMixin = (): string => {
  if (!globalLessMixin) {
    globalLessMixin = fs
      .readFileSync(path.resolve('./packages/shared/src/mixin.less'))
      .toString();
  }

  return globalLessMixin;
};

/**
 * 首字母大写
 */
export const ucfirst = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};
