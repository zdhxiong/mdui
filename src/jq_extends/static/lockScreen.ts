import $ from 'mdui.jq/es/$';
import 'mdui.jq/es/methods/addClass';
import 'mdui.jq/es/methods/data';
import 'mdui.jq/es/methods/width';
import { $body } from '../../utils/dom';

declare module 'mdui.jq/es/interfaces/JQStatic' {
  interface JQStatic {
    /**
     * 锁定屏页面，禁止页面滚动
     * @example
```js
$.lockScreen();
```
     */
    lockScreen(): void;
  }
}

$.lockScreen = function (): void {
  // 不直接把 body 设为 box-sizing: border-box，避免污染全局样式
  const newBodyWidth = $body.width();
  let level = $body.data('_lockscreen_level') || 0;

  $body
    .addClass('mdui-locked')
    .width(newBodyWidth)
    .data('_lockscreen_level', ++level);
};
