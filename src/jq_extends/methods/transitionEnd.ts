import $ from 'mdui.jq/es/$';
import { JQ } from 'mdui.jq/es/JQ';
import each from 'mdui.jq/es/functions/each';
import 'mdui.jq/es/methods/on';
import 'mdui.jq/es/methods/off';

declare module 'mdui.jq/es/JQ' {
  interface JQ<T = HTMLElement> {
    /**
     * 在当前元素上添加 transitionend 事件回调
     * @param callback 回调函数的参数为 `transitionend` 事件对象；`this` 指向当前元素
     * @example
```js
$('.box').transitionEnd(function() {
  alert('.box 元素的 transitionend 事件已触发');
});
```
     */
    transitionEnd(callback: (this: HTMLElement, e: Event) => void): this;
  }
}

$.fn.transitionEnd = function (
  this: JQ,
  callback: (this: HTMLElement, e: Event) => void,
): JQ {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const that = this;
  const events = ['webkitTransitionEnd', 'transitionend'];

  function fireCallback(this: Element | Document | Window, e: Event): void {
    if (e.target !== this) {
      return;
    }

    // @ts-ignore
    callback.call(this, e);

    each(events, (_, event) => {
      that.off(event, fireCallback);
    });
  }

  each(events, (_, event) => {
    that.on(event, fireCallback);
  });

  return this;
};
