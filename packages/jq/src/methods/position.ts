import JQElement from '../types/JQElement';
import { isElement, isNodeName } from '../utils';
import { JQ } from '../JQ';
import $ from '../$';
import './css';
import './offset';
import './offsetParent';

interface Coordinates {
  left: number;
  top: number;
  width?: number;
  height?: number;
}

declare module '../JQ' {
  interface JQ<T = JQElement> {
    /**
     * 获取元素相对于父元素的偏移
     * @example
```js
$('.box').position();
// { top: 20, left: 30, width: 100, height: 200 }
```
     */
    position(): Coordinates | undefined;
  }
}

$.fn.position = function(this: JQ): Coordinates | undefined {
  const element = this[0];

  if (!element || !isElement(element)) {
    return undefined;
  }

  let $offsetParent: JQ;
  let parentOffset: Coordinates = {
    left: 0,
    top: 0,
  };
  const offset = this.offset();

  if (!offset) {
    return undefined;
  }

  if (this.css('position') !== 'fixed') {
    $offsetParent = this.offsetParent();
    if (!isNodeName($offsetParent[0] as HTMLElement, 'html')) {
      parentOffset = $offsetParent.offset() as Coordinates;
    }

    parentOffset.top =
      parentOffset.top + parseFloat($offsetParent.css('borderTopWidth') || '');

    parentOffset.left =
      parentOffset.left +
      parseFloat($offsetParent.css('borderLeftWidth') || '');
  }

  return {
    top:
      offset.top - parentOffset.top - parseFloat(this.css('marginTop') || ''),
    left:
      offset.left -
      parentOffset.left -
      parseFloat(this.css('marginLeft') || ''),
    width: offset.width,
    height: offset.height,
  };
};
