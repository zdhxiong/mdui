import HTMLString from '../types/HTMLString';
import './val';

declare module '../JQ' {
  interface JQ<T = HTMLElement> {
    /**
     * 设置集合中所有元素的 HTML 内容
     * @param html
     * 可以是 HTML 字符串、DOM 元素、或回调函数（返回 HTML 字符串、DOM 元素）
     *
     * 回调函数的第一个参数为索引位置，第二个参数为旧的 HTML 字符串，`this` 指向当前元素
     *
     * 若该值、或函数返回值为 `undefined` 时，不修改对应的 HTML
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
     * 获取集合中第一个元素的 HTML 内容
     * @example
```js
$('#box').html()
```
     */
    html(): string;
  }
}
