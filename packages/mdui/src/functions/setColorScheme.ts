import { argbFromHex } from '@material/material-color-utilities';
import {
  setFromSource,
  generateMaterialDynamicScheme,
  type TMaterialGeneratorOptions,
  toStyleText,
  CustomColor,
} from './utils/colorScheme.js';
import type { JQ } from '@mdui/jq/shared/core.js';
// import { getDocument } from 'ssr-window';
// import { $ } from '@mdui/jq/$.js';

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

/**
 * 生成基于Material Design 3的设计令牌.
 * @param hex 十六进制的色彩代码
 * @param options ???
 * @returns 基于
 *  --md-sys-color-primary-palette-key-color: #eb0057;
 *  ...
 *  --md-sys-color-on-tertiary-fixed-variant: #00531e;
 */
export const generateMaterialScheme = (
  hex: string,
  options?: Partial<TMaterialGeneratorOptions>,
) => {
  return toStyleText(generateMaterialDynamicScheme(argbFromHex(hex), options));
};

export const applyMaterialScheme = (
  styleText: string,
  target: string | HTMLElement | JQ<HTMLElement>,
) => {
  target.setAttribute('style', styleText);

  /**
   * 目前Fork后的项目找不到部份依赖, 暂时使用`target.setAttribute('style', styleText)`代替如下部分
   */

  // const document = getDocument();
  // const $target = $(target || document.documentElement);
  // const cssText = `.mdui-theme { ${scheme} }`;
  // 移除旧的配色方案
  // remove($target);

  // 创建 <style> 元素，添加到 head 中
  // $(document.head).append(`<style id="$mdui-theme">${cssText}</style>`);

  // 添加新配色方案
  // $target.addClass('mdui-theme');
};
