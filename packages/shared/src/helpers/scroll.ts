import { getDocument } from 'ssr-window';
import { $ } from '@mdui/jq/$.js';
import '@mdui/jq/methods/addClass.js';
import '@mdui/jq/methods/append.js';
import '@mdui/jq/methods/appendTo.js';
import '@mdui/jq/methods/css.js';
import '@mdui/jq/methods/remove.js';
import '@mdui/jq/methods/removeClass.js';
import '@mdui/jq/methods/width.js';
import { isUndefined } from '@mdui/jq/shared/helper.js';

// 缓存滚动条宽度
let scrollBarSizeCached: number;

/**
 * 获取滚动条宽度
 * @param fresh 是否重新计算
 */
export const getScrollBarSize = (fresh?: boolean): number => {
  if (isUndefined(document)) {
    return 0;
  }

  if (fresh || scrollBarSizeCached === undefined) {
    const $inner = $('<div>').css({
      width: '100%',
      height: '200px',
    });

    const $outer = $('<div>')
      .css({
        position: 'absolute',
        top: '0',
        left: '0',
        pointerEvents: 'none',
        visibility: 'hidden',
        width: '200px',
        height: '150px',
        overflow: 'hidden',
      })
      .append($inner)
      .appendTo(document.body);

    const widthContained = $inner[0].offsetWidth;
    $outer.css('overflow', 'scroll');
    let widthScroll = $inner[0].offsetWidth;

    if (widthContained === widthScroll) {
      widthScroll = $outer[0].clientWidth;
    }

    $outer.remove();

    scrollBarSizeCached = widthContained - widthScroll;
  }

  return scrollBarSizeCached;
};

const lockMap = new WeakMap<
  HTMLElement, // 被锁定的元素
  Set<HTMLElement> // 触发锁定的元素
>();
const className = 'mdui-lock-screen';

/**
 * 锁定指定元素，禁止滚动。对同一个元素多次调用此方法，只会锁定一次
 * @param source 由该元素触发锁定
 * @param target 锁定该元素的滚动状态，默认为 body
 */
export const lockScreen = (source: HTMLElement, target?: HTMLElement): void => {
  const document = getDocument();

  target ??= document.body;

  if (!lockMap.has(target)) {
    lockMap.set(target, new Set());
  }

  const lock = lockMap.get(target)!;
  lock.add(source);

  $(target)
    .addClass(className)
    .css('width', `calc(100% - ${getScrollBarSize()}px)`);
};

/**
 * 解除指定元素的滚动状态锁定。
 * @param source 由该元素触发锁定
 * @param target 锁定该元素的滚动状态，默认为 body
 */
export const unlockScreen = (
  source: HTMLElement,
  target?: HTMLElement,
): void => {
  const document = getDocument();

  target ??= document.body;

  const lock = lockMap.get(target)!;
  lock.delete(source);

  if (lock.size === 0) {
    lockMap.delete(target);
    $(target).removeClass(className).width('');
  }
};
