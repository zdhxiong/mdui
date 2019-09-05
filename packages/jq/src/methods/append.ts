import JQElement from '../types/JQElement';
import JQSelector from '../types/JQSelector';
import { isElement, isString } from '../utils';
import { JQ } from '../JQ';
import $ from '../$';
import each from '../functions/each';
import './get';
import './each';

declare module '../JQ' {
  interface JQ<T = JQElement> {
    /**
     * 在当前元素内部的后面插入指定内容
     * @param contents 可以是字符串、HTML、JQ 对象、DOM 元素、DOM 元素数组、NodeList 等
     * @example
```js
$('<p>I would like to say: </p>').append('<b>Hello</b>');
// [ <p>I would like to say: <b>Hello</b></p> ]
```
     */
    append(contents: JQSelector): this;
  }
}

each(['append', 'prepend'], (nameIndex, name) => {
  $.fn[name] = function(this: JQ, newChild: JQSelector): JQ {
    let newChilds: any[];
    const copyByClone = this.length > 1;

    if (
      isString(newChild) &&
      (newChild[0] !== '<' || newChild[newChild.length - 1] !== '>')
    ) {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = newChild;
      newChilds = [].slice.call(tempDiv.childNodes);
    } else {
      newChilds = $(newChild).get();
    }

    if (nameIndex === 1) {
      // prepend
      newChilds.reverse();
    }

    return this.each((i, element) => {
      if (!isElement(element)) {
        return;
      }

      each(newChilds, (_, child) => {
        // 一个元素要同时追加到多个元素中，需要先复制一份，然后追加
        if (copyByClone && i > 0) {
          child = child.cloneNode(true);
        }

        if (nameIndex === 0) {
          // append
          element.appendChild(child);
        } else {
          // prepend
          element.insertBefore(child, element.childNodes[0]);
        }
      });
    });
  };
});
