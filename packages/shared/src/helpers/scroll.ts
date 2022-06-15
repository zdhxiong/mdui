import { $ } from '@mdui/jq/$.js';
import '@mdui/jq/methods/addClass.js';
import '@mdui/jq/methods/removeClass.js';

const locks = new Set();
const CSS_CLASS = 'mdui-lock-screen';

/**
 * 锁定 body，禁止滚动。对同一个元素多次调用此方法，只会锁定一次
 * @param element
 */
export const lockScreen = (element: HTMLElement) => {
  locks.add(element);
  $(document.body).addClass(CSS_CLASS);
};

/**
 * 解除 body 元素的滚动状态锁定。
 * @param element
 */
export const unlockScreen = (element: HTMLElement) => {
  locks.delete(element);

  if (locks.size === 0) {
    $(document.body).removeClass(CSS_CLASS);
  }
};
