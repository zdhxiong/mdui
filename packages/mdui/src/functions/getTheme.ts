import { $ } from '@mdui/jq/$.js';
import type { Theme } from './utils/theme.js';
import type { JQ } from '@mdui/jq/shared/core.js';

/**
 * 获取在指定元素上设置的主题。
 * 未传入参数时，默认获取 `<html>` 元素上的主题。
 * 元素上未设置过主题时，默认返回 `light`。
 * @param target 获取该元素上的主题。可以是 CSS 选择器、DOM 元素、或 JQ 对象。默认为 `<html>` 元素
 * @return Theme 当前主题，值为 `light`、`dark` 或 `auto`
 */
export const getTheme = (
  target: string | HTMLElement | JQ<HTMLElement> = document.documentElement,
): Theme => {
  const element = $(target)[0];
  const themes: Theme[] = ['light', 'dark', 'auto'];
  const prefix = 'mdui-theme-';

  return (Array.from(element.classList)
    .find((className) =>
      themes.map((theme) => prefix + theme).includes(className),
    )
    ?.slice(prefix.length) ?? 'light') as Theme;
};
