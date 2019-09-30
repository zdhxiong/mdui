import HTMLString from '../types/HTMLString';
import './val';

declare module '../JQ' {
  interface JQ<T = HTMLElement> {
    /**
     * 设置当前元素的 HTML 内容
     * @param html
     * @example
```js
$('#box').html('html content')
```
     */
    html(
      html:
        | HTMLString
        | Element
        | undefined
        | ((
            this: T,
            index: number,
            oldHtml: HTMLString,
          ) => HTMLString | Element | void | undefined),
    ): this;

    /**
     * 获取当前元素的 HTML 内容
     * @example
```js
$('#box').html()
```
     */
    html(): string | undefined;
  }
}
