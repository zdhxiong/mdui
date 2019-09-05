import JQElement from '../types/JQElement';
import JQSelector from '../types/JQSelector';
import { isString, isWindow } from '../utils';
import { JQ } from '../JQ';
import $ from '../$';
import contains from '../functions/contains';
import './filter';
import './find';

declare module '../JQ' {
  interface JQ<T = JQElement> {
    /**
     * 保留含有指定子元素的元素，去掉不含有指定子元素的元素
     * @param selector
     * @example ````给含有 ul 的 li 加上背景色
```js
$('li').has('ul').css('background-color', 'red');
```
     */
    has(selector: JQSelector): this;
  }
}

$.fn.has = function(this: JQ, selector: JQSelector): JQ {
  const $targets = isString(selector) ? this.find(selector) : $(selector);
  const { length } = $targets;

  return this.filter(function() {
    if (isWindow(this)) {
      return false;
    }

    for (let i = 0; i < length; i += 1) {
      if (contains(this, $targets[i] as HTMLElement)) {
        return true;
      }
    }

    return false;
  });
};
