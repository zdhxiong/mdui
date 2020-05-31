import $ from 'mdui.jq/es/$';
import 'mdui.jq/es/methods/data';
import 'mdui.jq/es/methods/removeClass';
import 'mdui.jq/es/methods/remove';
import '../methods/transitionEnd';

declare module 'mdui.jq/es/interfaces/JQStatic' {
  interface JQStatic {
    /**
     * 隐藏遮罩层
     *
     * 如果调用了多次 $.showOverlay() 来显示遮罩层，则也需要调用相同次数的 $.hideOverlay() 才能隐藏遮罩层。可以通过传入参数 true 来强制隐藏遮罩层。
     * @param force 是否强制隐藏遮罩
     * @example
```js
$.hideOverlay();
```
     * @example
```js
$.hideOverlay(true);
```
     */
    hideOverlay(force?: boolean): void;
  }
}

$.hideOverlay = function (force = false): void {
  const $overlay = $('.mdui-overlay');

  if (!$overlay.length) {
    return;
  }

  let level = force ? 1 : $overlay.data('_overlay_level');

  if (level > 1) {
    $overlay.data('_overlay_level', --level);
    return;
  }

  $overlay
    .data('_overlay_level', 0)
    .removeClass('mdui-overlay-show')
    .data('_overlay_is_deleted', true)
    .transitionEnd(() => {
      if ($overlay.data('_overlay_is_deleted')) {
        $overlay.remove();
      }
    });
};
