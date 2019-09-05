import JQElement from '../types/JQElement';
import JQSelector from '../types/JQSelector';
import { isElement } from '../utils';
import { JQ } from '../JQ';
import $ from '../$';
import each from '../functions/each';
import './each';

declare module '../JQ' {
  interface JQ<T = JQElement> {
    /**
     * 把当前元素插入到指定元素的前面
     * @param selector
     * @example
```js
$('<p>I would like to say: </p>').insertBefore('<b>Hello</b>');
// [ <p>I would like to say: </p><b>Hello</b> ]
```
     */
    insertBefore(selector: JQSelector): this;
  }
}

each(['insertBefore', 'insertAfter'], (nameIndex, name) => {
  $.fn[name] = function(this: JQ, selector: JQSelector): JQ {
    const $target = $(selector);

    return this.each((_, element) => {
      if (!isElement(element)) {
        return;
      }

      $target.each((_, target) => {
        if (!isElement(target) || !target.parentNode) {
          return;
        }

        target.parentNode.insertBefore(
          $target.length === 1 ? element : element.cloneNode(true),
          nameIndex === 0 ? target : target.nextSibling,
        );
      });
    });
  };
});
