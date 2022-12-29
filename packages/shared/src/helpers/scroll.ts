import { getDocument } from 'ssr-window';
import { $ } from '@mdui/jq/$.js';
import '@mdui/jq/methods/addClass.js';
import '@mdui/jq/methods/removeClass.js';

const locks = new Set();
const CSS_CLASS = 'mdui-lock-screen';

/**
 * 锁定指定元素，禁止滚动。对同一个元素多次调用此方法，只会锁定一次
 * @param element
 * @param target 锁定该元素的滚动状态，默认为 body
 */
export const lockScreen = (
  element: HTMLElement,
  target?: HTMLElement,
): void => {
  const document = getDocument();
  locks.add(element);
  $(target || document.body).addClass(CSS_CLASS);
};

/**
 * 解除指定元素的滚动状态锁定。
 * @param element
 * @param target 锁定该元素的滚动状态，默认为 body
 */
export const unlockScreen = (
  element: HTMLElement,
  target?: HTMLElement,
): void => {
  const document = getDocument();
  locks.delete(element);

  if (locks.size === 0) {
    $(target || document.body).removeClass(CSS_CLASS);
  }
};
