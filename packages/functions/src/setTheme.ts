import { argbFromHex } from '@importantimport/material-color-utilities';
import { setThemeFromSource } from './utils/theme.js';
import type { CustomColor } from './utils/theme.js';

/**
 * 在指定元素上设置主题
 * @param hex 十六进制颜色值，如 #f82506
 * @param options
 * @param options.target 要设置主题的元素，默认为 document.body
 * @param options.customColors 自定义颜色数组
 */
export const setTheme = (
  hex: string,
  options?: {
    target?: HTMLElement;
    customColors?: CustomColor[];
  },
): void => {
  const source = argbFromHex(hex);
  setThemeFromSource(source, options);
};
