import $ from '../$';
import each from '../functions/each';
import { JQ } from '../JQ';
import { isElement, isFunction } from '../utils';
import './attr';
import './each';

declare module '../JQ' {
  interface JQ<T = HTMLElement> {
    /**
     * 添加 CSS 类，多个类名用空格分割
     * @param className
     * @example ````在 p 元素上加上 item 类
```js
$('p').addClass('item')
```
     * @example ````在 p 元素上加上 item1 和 item2 两个类
```js
$('p').addClass('item1 item2')
```
     * @example ````在 p 元素上添加回调函数返回的类
```js
$('p').addClass(function () {
  return 'mdui';
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
  $.fn[`${name}Class`] = function(
    this: JQ,
    className:
      | string
      | ((this: any, index: number, currentClassName: string) => string),
  ): JQ {
    if (name === 'remove' && !arguments.length) {
      return this.attr('class', '');
    }

    return this.each((i, element) => {
      if (!isElement(element)) {
        return;
      }

      const classes = (isFunction(className)
        ? className.call(element, i, $(element).attr('class') || '')
        : className
      )
        .split(' ')
        .filter(name => name);

      each(classes, (_, cls) => {
        element.classList[name](cls);
      });
    });
  };
});
