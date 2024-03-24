import { $ } from '@mdui/jq/$.js';
import '@mdui/jq/methods/addClass.js';
import '@mdui/jq/methods/removeClass.js';
import type { Theme } from '../internal/theme.js';
import type { JQ } from '@mdui/jq/shared/core.js';

/**
 * 在当前页面、或指定元素上设置主题。
 * @param theme 要设置的主题。值为 `light`、`dark` 或 `auto`
 * @param target 在该元素上设置主题。可以是 CSS 选择器、DOM 元素、或 JQ 对象。默认为 `<html>` 元素
 */
export const setTheme = (
  theme: Theme,
  target: string | HTMLElement | JQ<HTMLElement> = document.documentElement,
): void => {
  const $target = $(target);
  const themes: Theme[] = ['light', 'dark', 'auto'];
  const prefix = 'mdui-theme-';

  $target
    .removeClass(themes.map((theme) => prefix + theme).join(' '))
    .addClass(prefix + theme);
};
