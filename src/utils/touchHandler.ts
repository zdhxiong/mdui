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
 *     .on(start, function (e) {
 *       if (!isAllow(e)) {
 *         return;
 *       }
 *       register(e);
 *       console.log(e.type);
 *     })
 *     .on(move, function (e) {
 *       if (!isAllow(e)) {
 *         return;
 *       }
 *       console.log(e.type);
 *     })
 *     .on(end, function (e) {
 *       if (!isAllow(e)) {
 *         return;
 *       }
 *       console.log(e.type);
 *     })
 *     .on(unlock, register);
 * })();
 */

const startEvent = 'touchstart mousedown';
const moveEvent = 'touchmove mousemove';
const endEvent = 'touchend mouseup';
const cancelEvent = 'touchcancel mouseleave';
const unlockEvent = 'touchend touchmove touchcancel';

let touches = 0;

/**
 * 该事件是否被允许，在执行事件前调用该方法判断事件是否可以执行
 * 若已触发 touch 事件，则阻止之后的鼠标事件
 * @param event
 */
function isAllow(event: Event): boolean {
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
    ].indexOf(event.type) > -1
  );
}

/**
 * 在 touchstart 和 touchmove、touchend、touchcancel 事件中调用该方法注册事件
 * @param event
 */
function register(event: Event): void {
  if (event.type === 'touchstart') {
    // 触发了 touch 事件
    touches += 1;
  } else if (
    ['touchmove', 'touchend', 'touchcancel'].indexOf(event.type) > -1
  ) {
    // touch 事件结束 500ms 后解除对鼠标事件的阻止
    setTimeout(function () {
      if (touches) {
        touches -= 1;
      }
    }, 500);
  }
}

export {
  startEvent,
  moveEvent,
  endEvent,
  cancelEvent,
  unlockEvent,
  isAllow,
  register,
};
