import { argbFromHex } from '@material/material-color-utilities';
import { setFromSource } from '../internal/colorScheme.js';
import type { CustomColor } from '../internal/colorScheme.js';
import type { JQ } from '@mdui/jq/shared/core.js';

/**
 * 在指定元素上设置配色方案
 * @param hex 十六进制颜色值，如 #f82506
 * @param options
 * @param options.target 要设置配色方案的元素。可以是 CSS 选择器、DOM 元素、或 JQ 对象。默认为 `<html>` 元素
 * @param options.customColors 自定义颜色数组
 * @param options.customColors[].name 自定义颜色名
 * @param options.customColors[].value 自定义十六进制颜色值，如 #f82506
 */
export const setColorScheme = (
  hex: string,
  options?: {
    target?: string | HTMLElement | JQ<HTMLElement>;
    customColors?: CustomColor[];
  },
): void => {
  const source = argbFromHex(hex);
  setFromSource(source, options);
};
