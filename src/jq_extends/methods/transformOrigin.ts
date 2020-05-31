import $ from 'mdui.jq/es/$';
import { JQ } from 'mdui.jq/es/JQ';
import 'mdui.jq/es/methods/each';

declare module 'mdui.jq/es/JQ' {
  interface JQ<T = HTMLElement> {
    /**
     * 设置当前元素的 transform-origin 属性
     * @param transformOrigin
     * @example
```js
$('.box').transformOrigin('top center');
```
     */
    transformOrigin(transformOrigin: string): this;
  }
}

$.fn.transformOrigin = function (this: JQ, transformOrigin: string): JQ {
  return this.each(function () {
    this.style.webkitTransformOrigin = transformOrigin;
    this.style.transformOrigin = transformOrigin;
  });
};
