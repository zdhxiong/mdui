import { $ } from '../$.js';
import { parse } from '../shared/event.js';
import './each.js';
import type { JQ } from '../shared/core.js';
import type { PlainObject } from '../shared/helper.js';

declare module '../shared/core.js' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface JQ<T = HTMLElement> {
    /**
     * 触发指定的事件
     * @param type 事件名
     * @param detail 传给事件处理函数的额外参数
     * @param options CustomEvent 的初始化参数
     * @example ````触发 .box 元素上的 click 事件
```js
$('.box').trigger('click');
```
     * @example ````触发 .box 元素上的 click 事件，并给事件处理函数传入额外参数
```js
$('.box').trigger('click', {key1: 'value1', key2: 'value2'});
```
     */
    trigger(
      type: string,
      detail?: unknown[] | PlainObject | string | number | boolean,
      options?: EventInit,
    ): this;
  }
}

// eslint-disable-next-line
$.fn.trigger = function (this: JQ, name: string, detail: any = null, options?: CustomEventInit): JQ {
  const { type, ns } = parse(name);

  const event = new CustomEvent(type, {
    detail,
    bubbles: true,
    cancelable: false,
    composed: true,
    ...options,
  });

  // @ts-ignore
  event._ns = ns;

  return this.each((_, element) => {
    element.dispatchEvent(event);
  });
};
