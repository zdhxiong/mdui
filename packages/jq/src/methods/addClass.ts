import $ from '../$';
import each from '../functions/each';
import './each';
import JQElement from '../types/JQElement';
import { isElement } from '../utils';
import { JQ } from '../JQ';

declare module '../JQ' {
  interface JQ<T = JQElement> {
    /**
     * 添加 CSS 类，多个类名用空格分割
     * @param className
     * @example ````在 p 元素上加上 item 类
```js
$('p').addClass('item')
```
     @example ````在 p 元素上加上 item1 和 item2 两个类
```js
$('p').addClass('item1 item2')
```
     */
    addClass(className: string): this;
  }
}

type classListMethod = 'add' | 'remove' | 'toggle';

each(['add', 'remove', 'toggle'], (_, name: classListMethod) => {
  $.fn[`${name}Class`] = function(this: JQ, className: string): JQ {
    if (!className) {
      return this;
    }

    const classes = className.split(' ');

    return this.each((_, element) => {
      if (!isElement(element)) {
        return;
      }

      each(classes, (_, cls) => {
        element.classList[name](cls);
      });
    });
  };
});
