import $ from '../$';
import PlainObject from '../interfaces/PlainObject';
import { JQ } from '../JQ';
import './each';
import { parse } from './utils/event';

declare module '../JQ' {
  interface JQ<T = HTMLElement> {
    /**
     * 触发指定的事件
     * @param type 事件名
     * @param extraParameters 传给事件处理函数的额外参数
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
      extraParameters?: any[] | PlainObject | string | number | boolean,
    ): this;
  }
}

$.fn.trigger = function (this: JQ, type: string, extraParameters: any): JQ {
  type EventParams = {
    detail?: any;
    bubbles: boolean;
    cancelable: boolean;
  };

  const event = parse(type);
  let eventObject: MouseEvent | CustomEvent;
  const eventParams: EventParams = {
    bubbles: true,
    cancelable: true,
  };
  const isMouseEvent =
    ['click', 'mousedown', 'mouseup', 'mousemove'].indexOf(event.type) > -1;

  if (isMouseEvent) {
    // Note: MouseEvent 无法传入 detail 参数
    eventObject = new MouseEvent(event.type, eventParams);
  } else {
    eventParams.detail = extraParameters;
    eventObject = new CustomEvent(event.type, eventParams);
  }

  // @ts-ignore
  eventObject._detail = extraParameters;

  // @ts-ignore
  eventObject._ns = event.ns;

  return this.each(function () {
    this.dispatchEvent(eventObject);
  });
};
