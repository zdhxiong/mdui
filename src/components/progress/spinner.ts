import $ from 'mdui.jq/es/$';
import 'mdui.jq/es/methods/each';
import 'mdui.jq/es/methods/hasClass';
import 'mdui.jq/es/methods/html';
import Selector from 'mdui.jq/es/types/Selector';
import { isUndefined } from 'mdui.jq/es/utils';
import mdui from '../../mdui';
import '../../global/mutation';

declare module '../../interfaces/MduiStatic' {
  interface MduiStatic {
    /**
     * 如果需要修改已有的圆形进度条组件，需要调用该方法来重新初始化组件。
     *
     * 若传入了参数，则只重新初始化该参数对应的圆形进度条。若没有传入参数，则重新初始化所有圆形进度条。
     * @param selector CSS 选择器、或 DOM 元素、或 DOM 元素组成的数组、或 JQ 对象
     */
    updateSpinners(
      selector?: Selector | HTMLElement | ArrayLike<HTMLElement>,
    ): void;
  }
}

/**
 * layer 的 HTML 结构
 * @param index
 */
function layerHTML(index: number | false = false): string {
  return (
    `<div class="mdui-spinner-layer ${
      index ? `mdui-spinner-layer-${index}` : ''
    }">` +
    '<div class="mdui-spinner-circle-clipper mdui-spinner-left">' +
    '<div class="mdui-spinner-circle"></div>' +
    '</div>' +
    '<div class="mdui-spinner-gap-patch">' +
    '<div class="mdui-spinner-circle"></div>' +
    '</div>' +
    '<div class="mdui-spinner-circle-clipper mdui-spinner-right">' +
    '<div class="mdui-spinner-circle"></div>' +
    '</div>' +
    '</div>'
  );
}

/**
 * 填充 HTML
 * @param spinner
 */
function fillHTML(spinner: HTMLElement): void {
  const $spinner = $(spinner);

  const layer = $spinner.hasClass('mdui-spinner-colorful')
    ? layerHTML(1) + layerHTML(2) + layerHTML(3) + layerHTML(4)
    : layerHTML();

  $spinner.html(layer);
}

$(() => {
  // 页面加载完后自动填充 HTML 结构
  mdui.mutation('.mdui-spinner', function () {
    fillHTML(this);
  });
});

mdui.updateSpinners = function (
  selector?: Selector | HTMLElement | ArrayLike<HTMLElement>,
): void {
  const $elements = isUndefined(selector) ? $('.mdui-spinner') : $(selector);

  $elements.each(function () {
    fillHTML(this);
  });
};
