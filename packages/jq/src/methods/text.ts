import './val';

declare module '../JQ' {
  interface JQ<T = HTMLElement> {
    /**
     * 设置当前元素的文本内容
     * @param text
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
     * 获取当前元素的文本内容
     * @example
```js
$('#box').text()
```
     */
    text(): string;
  }
}
