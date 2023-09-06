import { remove } from './utils/colorScheme.js';
import type { JQ } from '@mdui/jq/shared/core.js';

/**
 * 移除指定元素上的配色方案
 * @param target 要移除配色方案的元素。可以是 CSS 选择器、DOM 元素、或 JQ 对象。默认为 `<html>` 元素
 */
export const removeColorScheme = (
  target: string | HTMLElement | JQ<HTMLElement> = document.documentElement,
): void => {
  remove(target);
};
