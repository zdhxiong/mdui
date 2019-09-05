import $ from '../$';
import JQElement from '../types/JQElement';

declare module '../JQ' {
  interface JQ<T = JQElement> {
    /**
     * 是否含有指定的 CSS 类
     * @param className
     * @example
```js
$('div').hasClass('item')
```
     */
    hasClass(className: string): boolean;
  }
}

$.fn.hasClass = function(className: string): boolean {
  if (!this[0] || !className) {
    return false;
  }

  return this[0].classList.contains(className);
};
