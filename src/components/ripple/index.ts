/**
 * Inspired by https://github.com/nolimits4web/Framework7/blob/master/src/js/fast-clicks.js
 * https://github.com/nolimits4web/Framework7/blob/master/LICENSE
 *
 * Inspired by https://github.com/fians/Waves
 */

import $ from 'mdui.jq/es/$';
import { JQ } from 'mdui.jq/es/JQ';
import 'mdui.jq/es/methods/addClass';
import 'mdui.jq/es/methods/attr';
import 'mdui.jq/es/methods/children';
import 'mdui.jq/es/methods/data';
import 'mdui.jq/es/methods/each';
import 'mdui.jq/es/methods/first';
import 'mdui.jq/es/methods/hasClass';
import 'mdui.jq/es/methods/innerHeight';
import 'mdui.jq/es/methods/innerWidth';
import 'mdui.jq/es/methods/off';
import 'mdui.jq/es/methods/offset';
import 'mdui.jq/es/methods/on';
import 'mdui.jq/es/methods/parents';
import 'mdui.jq/es/methods/prependTo';
import 'mdui.jq/es/methods/prop';
import 'mdui.jq/es/methods/remove';
import { isUndefined } from 'mdui.jq/es/utils';
import '../../jq_extends/methods/reflow';
import '../../jq_extends/methods/transform';
import '../../jq_extends/methods/transitionEnd';
import { $document } from '../../utils/dom';
import {
  cancelEvent,
  endEvent,
  isAllow,
  moveEvent,
  register,
  startEvent,
  unlockEvent,
} from '../../utils/touchHandler';

/**
 * 显示涟漪动画
 * @param event
 * @param $ripple
 */
function show(event: Event, $ripple: JQ): void {
  // 鼠标右键不产生涟漪
  if (event instanceof MouseEvent && event.button === 2) {
    return;
  }

  // 点击位置坐标
  const touchPosition =
    typeof TouchEvent !== 'undefined' &&
    event instanceof TouchEvent &&
    event.touches.length
      ? event.touches[0]
      : (event as MouseEvent);

  const touchStartX = touchPosition.pageX;
  const touchStartY = touchPosition.pageY;

  // 涟漪位置
  const offset = $ripple.offset();
  const height = $ripple.innerHeight();
  const width = $ripple.innerWidth();
  const center = {
    x: touchStartX - offset.left,
    y: touchStartY - offset.top,
  };
  const diameter = Math.max(
    Math.pow(Math.pow(height, 2) + Math.pow(width, 2), 0.5),
    48,
  );

  // 涟漪扩散动画
  const translate =
    `translate3d(${-center.x + width / 2}px,` +
    `${-center.y + height / 2}px, 0) scale(1)`;

  // 涟漪的 DOM 结构，并缓存动画效果
  $(
    `<div class="mdui-ripple-wave" ` +
      `style="width:${diameter}px;height:${diameter}px;` +
      `margin-top:-${diameter / 2}px;margin-left:-${diameter / 2}px;` +
      `left:${center.x}px;top:${center.y}px;"></div>`,
  )
    .data('_ripple_wave_translate', translate)
    .prependTo($ripple)
    .reflow()
    .transform(translate);
}

/**
 * 隐藏并移除涟漪
 * @param $wave
 */
function removeRipple($wave: JQ): void {
  if (!$wave.length || $wave.data('_ripple_wave_removed')) {
    return;
  }

  $wave.data('_ripple_wave_removed', true);

  let removeTimer = setTimeout(() => $wave.remove(), 400);
  const translate = $wave.data('_ripple_wave_translate');

  $wave
    .addClass('mdui-ripple-wave-fill')
    .transform(translate.replace('scale(1)', 'scale(1.01)'))
    .transitionEnd(() => {
      clearTimeout(removeTimer);

      $wave
        .addClass('mdui-ripple-wave-out')
        .transform(translate.replace('scale(1)', 'scale(1.01)'));

      removeTimer = setTimeout(() => $wave.remove(), 700);

      setTimeout(() => {
        $wave.transitionEnd(() => {
          clearTimeout(removeTimer);
          $wave.remove();
        });
      }, 0);
    });
}

/**
 * 隐藏涟漪动画
 * @param this
 */
function hide(this: any): void {
  const $ripple = $(this as HTMLElement);

  $ripple.children('.mdui-ripple-wave').each((_, wave) => {
    removeRipple($(wave));
  });

  $ripple.off(`${moveEvent} ${endEvent} ${cancelEvent}`, hide);
}

/**
 * 显示涟漪，并绑定 touchend 等事件
 * @param event
 */
function showRipple(event: Event): void {
  if (!isAllow(event)) {
    return;
  }

  register(event);

  // Chrome 59 点击滚动条时，会在 document 上触发事件
  if (event.target === document) {
    return;
  }

  const $target = $(event.target as HTMLElement);

  // 获取含 .mdui-ripple 类的元素
  const $ripple = $target.hasClass('mdui-ripple')
    ? $target
    : $target.parents('.mdui-ripple').first();

  if (!$ripple.length) {
    return;
  }

  // 禁用状态的元素上不产生涟漪效果
  if ($ripple.prop('disabled') || !isUndefined($ripple.attr('disabled'))) {
    return;
  }

  if (event.type === 'touchstart') {
    let hidden = false;

    // touchstart 触发指定时间后开始涟漪动画，避免手指滑动时也触发涟漪
    let timer = setTimeout(() => {
      timer = 0;
      show(event, $ripple);
    }, 200);

    const hideRipple = (): void => {
      // 如果手指没有移动，且涟漪动画还没有开始，则开始涟漪动画
      if (timer) {
        clearTimeout(timer);
        timer = 0;
        show(event, $ripple);
      }

      if (!hidden) {
        hidden = true;
        hide.call($ripple);
      }
    };

    // 手指移动后，移除涟漪动画
    const touchMove = (): void => {
      if (timer) {
        clearTimeout(timer);
        timer = 0;
      }

      hideRipple();
    };

    $ripple.on('touchmove', touchMove).on('touchend touchcancel', hideRipple);
  } else {
    show(event, $ripple);
    $ripple.on(`${moveEvent} ${endEvent} ${cancelEvent}`, hide);
  }
}

$(() => {
  $document.on(startEvent, showRipple).on(unlockEvent, register);
});
