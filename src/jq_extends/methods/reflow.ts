import $ from 'mdui.jq/es/$';
import { JQ } from 'mdui.jq/es/JQ';
import 'mdui.jq/es/methods/each';

declare module 'mdui.jq/es/JQ' {
  interface JQ<T = HTMLElement> {
    /**
     * 强制重绘当前元素
     *
     * @example
```js
$('.box').reflow();
```
     */
    reflow(): this;
  }
}

$.fn.reflow = function (this: JQ): JQ {
  return this.each(function () {
    return this.clientLeft;
  });
};
