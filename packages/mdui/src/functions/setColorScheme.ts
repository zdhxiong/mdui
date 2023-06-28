import { argbFromHex } from '@material/material-color-utilities';
import { setThemeFromSource } from './utils/colorScheme.js';
import type { CustomColor } from './utils/colorScheme.js';

/**
 * 在指定元素上设置配色方案
 * @param hex 十六进制颜色值，如 #f82506
 * @param options
 * @param options.target 要设置配色方案的元素，默认为 document.body
 * @param options.customColors 自定义颜色数组
 * @param options.customColors[].name 自定义颜色名
 * @param options.customColors[].value 自定义十六进制颜色值，如 #f82506
 */
export const setColorScheme = (
  hex: string,
  options?: {
    target?: HTMLElement;
    customColors?: CustomColor[];
  },
): void => {
  const source = argbFromHex(hex);
  setThemeFromSource(source, options);
};
