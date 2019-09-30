import $ from '../$';
import each from '../functions/each';
import PlainObject from '../interfaces/PlainObject';
import { JQ } from '../JQ';
import { isFunction, isObjectLike } from '../utils';
import './each';
import { remove } from './utils/event';

declare module '../JQ' {
  interface JQ<T = HTMLElement> {
    /**
     * 解除通过事件委托绑定的指定事件
     * @param eventName
     * @param selector
     * @param callback
     * @example
```js
$(document).off('click', '.box', function () {});
```
     * @example
```js
$(document).off('click dbclick', '.box', function () {});
```
     * @example
```js
$(document).off('click', '.box');
```
     * @example
```js
$(document).off('click dbclick', '.box');
```
     */
    off(eventName: string, selector: string, callback?: Function): this;

    /**
     * 解除绑定的指定事件
     * @param eventName
     * @param callback
     * @example
```js
$('.box').off('click', function () {});
```
     * @example
```js
$('.box').off('click dbclick', function () {});
```
     * @example
```js
$('.box').off('click');
```
     * @example
```js
$('.box').off('click dbclick');
```
     */
    off(eventName: string, callback?: Function): this;

    /**
     * 同时移除多个事件处理函数
     * @param events
     * @param selector
     * @example
```js
$('.wrapper').off({
  'click': function () {},
  'dbclick': function () {},
}, '.box')
```
     * @example
```js
$('.wrapper').off({
  'click': function () {},
  'dbclick': function () {},
})
```
     */
    off(events: PlainObject<Function>, selector?: string): this;
  }
}

$.fn.off = function(
  this: JQ,
  eventName: PlainObject<Function> | string,
  selector?: any,
  callback?: any,
): any {
  // eventName 是对象
  if (isObjectLike(eventName)) {
    each(eventName, (type: string, fn: Function) => {
      // this.off('click', undefined, function () {})
      // this.off('click', '.box', function () {})
      this.off(type, selector, fn);
    });

    return this;
  }

  // selector 不存在
  if (isFunction(selector)) {
    callback = selector;
    selector = undefined;
    // this.off('click', undefined, function () {})
  }

  return this.each(function() {
    remove(this, eventName, callback, selector);
  });
};
