import $ from '../$';

declare module '../JQ' {
  interface JQ<T = HTMLElement> {
    /**
     * 是否含有指定的 CSS 类
     * @param className CSS 类名
     * @example
```js
$('div').hasClass('item')
```
     */
    hasClass(className: string): boolean;
  }
}

$.fn.hasClass = function (className: string): boolean {
  return this[0].classList.contains(className);
};
