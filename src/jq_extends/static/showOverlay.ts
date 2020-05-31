import $ from 'mdui.jq/es/$';
import { JQ } from 'mdui.jq/es/JQ';
import { isUndefined } from 'mdui.jq/es/utils';
import 'mdui.jq/es/methods/data';
import 'mdui.jq/es/methods/css';
import 'mdui.jq/es/methods/appendTo';
import 'mdui.jq/es/methods/addClass';
import '../methods/reflow';

declare module 'mdui.jq/es/interfaces/JQStatic' {
  interface JQStatic {
    /**
     * 创建并显示遮罩，返回遮罩层的 JQ 对象
     * @param zIndex 遮罩层的 `z-index` 值，默认为 `2000`
     * @example
```js
$.showOverlay();
```
     * @example
```js
$.showOverlay(3000);
```
     */
    showOverlay(zIndex?: number): JQ;
  }
}

$.showOverlay = function (zIndex?: number): JQ {
  let $overlay = $('.mdui-overlay');

  if ($overlay.length) {
    $overlay.data('_overlay_is_deleted', false);

    if (!isUndefined(zIndex)) {
      $overlay.css('z-index', zIndex);
    }
  } else {
    if (isUndefined(zIndex)) {
      zIndex = 2000;
    }

    $overlay = $('<div class="mdui-overlay">')
      .appendTo(document.body)
      .reflow()
      .css('z-index', zIndex);
  }

  let level = $overlay.data('_overlay_level') || 0;

  return $overlay.data('_overlay_level', ++level).addClass('mdui-overlay-show');
};
