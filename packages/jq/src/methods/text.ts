import JQElement from '../types/JQElement';
import './val';

declare module '../JQ' {
  interface JQ<T = JQElement> {
    /**
     * 设置当前元素的文本内容
     * @param text
     * @example
```js
$('#box').text('text content')
```
     */
    text(text: string | number | boolean): this;

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
