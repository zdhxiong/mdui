import $ from '../$';
import each from '../functions/each';
import { JQ } from '../JQ';
import HTMLString from '../types/HTMLString';
import Selector from '../types/Selector';
import TypeOrArray from '../types/TypeOrArray';
import './each';
import './remove';

declare module '../JQ' {
  interface JQ<T = HTMLElement> {
    /**
     * 把当前集合中的元素插入到指定元素的前面，作为目标元素的兄弟元素
     * 如果当前集合中的元素是页面中已有的元素，则将移动该元素，而不是复制
     * 如果有多个目标元素，则将克隆当前集合中的元素，并添加到每个目标元素的前面
     * @param selector
     * @returns 由新插入的元素组成的集合
     * @example
```js
$('<p>I would like to say: </p>').insertBefore('<b>Hello</b>');
// [ <p>I would like to say: </p><b>Hello</b> ]
```
     */
    insertBefore(
      target: Selector | HTMLString | TypeOrArray<Node> | JQ<Node>,
    ): this;
  }
}

each(['insertBefore', 'insertAfter'], (nameIndex, name) => {
  $.fn[name] = function(this: JQ, target: any): JQ {
    const $element = nameIndex === 1 ? $(this.get().reverse()) : this; // 顺序和 jQuery 保持一致
    const result: HTMLElement[] = [];

    $(target).each((_, target) => {
      if (!target.parentNode) {
        return;
      }

      $element.each((_, element) => {
        const newItem = element.cloneNode(true);
        const existingItem = nameIndex ? target.nextSibling : target;

        result.push(newItem as HTMLElement);
        target.parentNode.insertBefore(newItem, existingItem);
      });
    });

    $element.remove();

    return $(nameIndex === 1 ? result.reverse() : result);
  };
});
