import $ from '../$';
import contains from '../functions/contains';

declare module '../interfaces/JQStatic' {
  interface JQStatic {
    /**
     * 检查 parent 元素内是否包含 child 元素
     * @param parent 父元素
     * @param child 子元素
     * @example
```js
$.contains( document.documentElement, document.body ); // true
$.contains( document.body, document.documentElement ); // false
```
     */
    contains(
      parent: HTMLElement | HTMLDocument,
      child: HTMLElement | HTMLDocument,
    ): boolean;

    /**
     * 检查当前页面中是否包含指定元素
     * @param child 被检查的子元素
     * @example
```js
$.contains( document.body ); // true
$.contains( document.documentElement ); // false
```
     */
    contains(child: HTMLElement | HTMLDocument): boolean;
  }
}

$.contains = contains;
