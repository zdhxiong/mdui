import './val';

declare module '../JQ' {
  interface JQ<T = HTMLElement> {
    /**
     * 设置当前集合中，每个元素的文本内容
     * @param text
     * 用于设置的文本
     *
     * 可以为字符串、数值、布尔值、或回调函数
     *
     * 回调函数的第一个参数为元素的索引位置，第二个参数为当前元素的文本内容，`this` 指向当前元素
     *
     * 若文本值或函数返回值为 `undefined`，则不修改对应的文本
     * @example
```js
$('#box').text('text content')
```
     */
    text(
      text:
        | string
        | number
        | boolean
        | undefined
        | ((
            this: T,
            index: number,
            oldText: string,
          ) => string | number | boolean | void | undefined),
    ): this;

    /**
     * 获取当前集合中，所有元素的文本内容（包含它们的后代）
     * @example
```js
$('#box').text()
```
     */
    text(): string;
  }
}
