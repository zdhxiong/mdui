import $ from '../$';
import each from '../functions/each';
import { JQ } from '../JQ';
import HTMLString from '../types/HTMLString';
import Selector from '../types/Selector';
import TypeOrArray from '../types/TypeOrArray';
import './insertAfter';
import './insertBefore';
import './remove';

declare module '../JQ' {
  interface JQ<T = HTMLElement> {
    /**
     * 把当前元素追加到指定元素内部的后面
     * @param selector
     * @returns 由新插入的元素组成的集合
     * @example
```js
$('<p>Hello</p>').appendTo('<p>I would like to say: </p>')
// [ <p>I would like to say: <p>Hello</p></p> ]
```
     */
    appendTo(target: Selector | HTMLString | TypeOrArray<Element> | JQ): this;
  }
}

each(['appendTo', 'prependTo'], (nameIndex, name) => {
  $.fn[name] = function(this: JQ, target: any): JQ {
    const extraChilds: HTMLElement[] = [];
    const $target = $(target).map((_, element: HTMLElement) => {
      const childNodes = element.childNodes;
      const childLength = childNodes.length;

      if (childLength) {
        return childNodes[nameIndex ? 0 : childLength - 1];
      }

      const child = document.createElement('div');
      element.append(child);
      extraChilds.push(child);

      return child;
    });

    const $result = this[nameIndex ? 'insertBefore' : 'insertAfter']($target);

    $(extraChilds).remove();

    return $result;
  };
});
