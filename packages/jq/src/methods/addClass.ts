import { $ } from '../$.js';
import { getAttribute, setAttribute } from '../shared/attributes.js';
import { isElement, isFunction, eachArray } from '../shared/helper.js';
import './each.js';
import type { JQ } from '../shared/core.js';

declare module '../shared/core.js' {
  interface JQ<T = HTMLElement> {
    /**
     * 为集合中的每个元素添加 CSS 类
     * @param className
     * CSS 类名的字符串，多个类名可以用空格分隔
     *
     * 也可以是一个返回 CSS 类名的回调函数。回调函数的第一个参数为元素的索引位置，第二个参数为该元素上原有的 CSS 类名，函数中的 `this` 指向当前元素。
     * @example
```js
// 在 p 元素上加上 item 类
$('p').addClass('item')
```
     * @example
```js
// 在 p 元素上加上 item1 和 item2 两个类
$('p').addClass('item1 item2')
```
     * @example
```js
// 在 p 元素上添加由回调函数返回的类
$('p').addClass(function (index, currentClassName) {
  return currentClassName + '-' + index;
});
```
     */
    addClass(
      className:
        | string
        | ((this: T, index: number, currentClassName: string) => string),
    ): this;
  }
}

type Method = 'add' | 'remove' | 'toggle';

eachArray<Method>(['add', 'remove', 'toggle'], (name) => {
  $.fn[`${name}Class` as 'addClass'] = function (
    this: JQ,
    className:
      | string
      | ((
          this: HTMLElement,
          index: number,
          currentClassName: string,
        ) => string),
  ): JQ {
    if (name === 'remove' && !arguments.length) {
      return this.each((_, element) => {
        setAttribute(element, 'class', '');
      });
    }

    return this.each((i, element) => {
      if (!isElement(element)) {
        return;
      }
      const classes = (
        isFunction(className)
          ? className.call(
              element,
              i,
              <string>getAttribute(element, 'class', ''),
            )
          : className
      )
        .split(' ')
        .filter((name) => name);

      eachArray(classes, (cls) => {
        element.classList[name](cls);
      });
    });
  };
});
