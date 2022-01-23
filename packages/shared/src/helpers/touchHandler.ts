/**
 * touch 事件后的 500ms 内禁用 mousedown 事件
 *
 * 不支持触控的屏幕上事件顺序为 mousedown -> mouseup -> click
 * 支持触控的屏幕上事件顺序为 touchstart -> touchend -> mousedown -> mouseup -> click
 *
 * 在每一个事件中都使用 TouchHandler.isAllow(event) 判断事件是否可执行
 * 在 touchstart 和 touchmove、touchend、touchcancel
 *
 * (function () {
 *   $document
 *     .on(startEvent, function (e) {
 *       if (!isAllow(e)) {
 *         return;
 *       }
 *       register(e);
 *       console.log(e.type);
 *     })
 *     .on(moveEvent, function (e) {
 *       if (!isAllow(e)) {
 *         return;
 *       }
 *       console.log(e.type);
 *     })
 *     .on(endEvent, function (e) {
 *       if (!isAllow(e)) {
 *         return;
 *       }
 *       console.log(e.type);
 *     })
 *     .on(unlockEvent, register);
 * })();
 */

export const startEvent = 'touchstart mousedown';
export const moveEvent = 'touchmove mousemove';
export const endEvent = 'touchend mouseup';
export const cancelEvent = 'touchcancel mouseleave';
export const unlockEvent = 'touchend touchmove touchcancel';

let touches = 0;

/**
 * 该事件是否被允许，在执行事件前调用该方法判断事件是否可以执行
 * 若已触发 touch 事件，则阻止之后的鼠标事件
 * @param event
 */
export const isAllow = (event: Event): boolean => {
  return !(
    touches &&
    [
      'mousedown',
      'mouseup',
      'mousemove',
      'click',
      'mouseover',
      'mouseout',
      'mouseenter',
      'mouseleave',
    ].includes(event.type)
  );
};

/**
 * 在 touchstart 和 touchmove、touchend、touchcancel 事件中调用该方法注册事件
 * @param event
 */
export const register = (event: Event): void => {
  if (event.type === 'touchstart') {
    // 触发了 touch 事件
    touches += 1;
  } else if (['touchmove', 'touchend', 'touchcancel'].includes(event.type)) {
    // touch 事件结束 500ms 后解除对鼠标事件的阻止
    setTimeout(() => {
      if (touches) {
        touches -= 1;
      }
    }, 500);
  }
};
