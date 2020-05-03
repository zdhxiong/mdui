import $ from '../$';
import each from '../functions/each';
import { JQ } from '../JQ';
import { isElement, isFunction } from '../utils';
import './each';

declare module '../JQ' {
  interface JQ<T = HTMLElement> {
    /**
     * 在当前元素上添加 CSS 类
     * @param className
     * CSS 类名的字符串，多个类名可以用空格分隔
     *
     * 也可以是一个返回 CSS 类名的回调函数。回调函数的第一个参数为元素的索引位置，第二个参数为旧的 CSS 类名，`this` 指向当前元素
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

type classListMethod = 'add' | 'remove' | 'toggle';

each(['add', 'remove', 'toggle'], (_, name: classListMethod) => {
  $.fn[`${name}Class`] = function (
    this: JQ,
    className:
      | string
      | ((this: any, index: number, currentClassName: string) => string),
  ): JQ {
    if (name === 'remove' && !arguments.length) {
      return this.each((_, element) => {
        element.setAttribute('class', '');
      });
    }

    return this.each((i, element) => {
      if (!isElement(element)) {
        return;
      }

      const classes = (isFunction(className)
        ? className.call(element, i, element.getAttribute('class') || '')
        : className
      )
        .split(' ')
        .filter((name) => name);

      each(classes, (_, cls) => {
        element.classList[name](cls);
      });
    });
  };
});
