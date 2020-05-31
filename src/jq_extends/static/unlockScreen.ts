import $ from 'mdui.jq/es/$';
import 'mdui.jq/es/methods/data';
import 'mdui.jq/es/methods/removeClass';
import 'mdui.jq/es/methods/width';
import { $body } from '../../utils/dom';

declare module 'mdui.jq/es/interfaces/JQStatic' {
  interface JQStatic {
    /**
     * 解除页面锁定
     *
     * 如果调用了多次 $.lockScreen() 来显示遮罩层，则也需要调用相同次数的 $.unlockScreen() 才能隐藏遮罩层。可以通过传入参数 true 来强制隐藏遮罩层。
     * @param force 是否强制解除锁定
     * @example
```js
$.unlockScreen();
```
     * @example
```js
$.unlockScreen(true);
```
     */
    unlockScreen(force?: boolean): void;
  }
}

$.unlockScreen = function (force = false): void {
  let level = force ? 1 : $body.data('_lockscreen_level');

  if (level > 1) {
    $body.data('_lockscreen_level', --level);
    return;
  }

  $body.data('_lockscreen_level', 0).removeClass('mdui-locked').width('');
};
