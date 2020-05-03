import $ from '../$';
import { JQ } from '../JQ';
import './css';
import './eq';
import './offset';
import './offsetParent';

interface Coordinates {
  left: number;
  top: number;
}

declare module '../JQ' {
  interface JQ<T = HTMLElement> {
    /**
     * 获取集合中第一个元素相对于父元素的偏移
     * @example
```js
$('.box').position();
// { top: 20, left: 30 }
```
     */
    position(): Coordinates;
  }
}

function floatStyle($element: JQ, name: string): number {
  return parseFloat($element.css(name));
}

$.fn.position = function (this: JQ): Coordinates | undefined {
  if (!this.length) {
    return undefined;
  }

  const $element = this.eq(0);

  let currentOffset: Coordinates;
  let parentOffset: Coordinates = {
    left: 0,
    top: 0,
  };

  if ($element.css('position') === 'fixed') {
    currentOffset = $element[0].getBoundingClientRect();
  } else {
    currentOffset = $element.offset();

    const $offsetParent = $element.offsetParent();
    parentOffset = $offsetParent.offset();
    parentOffset.top += floatStyle($offsetParent, 'border-top-width');
    parentOffset.left += floatStyle($offsetParent, 'border-left-width');
  }

  return {
    top:
      currentOffset.top - parentOffset.top - floatStyle($element, 'margin-top'),
    left:
      currentOffset.left -
      parentOffset.left -
      floatStyle($element, 'margin-left'),
  };
};
