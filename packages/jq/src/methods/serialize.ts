import JQElement from '../types/JQElement';
import { JQ } from '../JQ';
import $ from '../$';
import each from '../functions/each';
import './serializeArray';

declare module '../JQ' {
  interface JQ<T = JQElement> {
    /**
     * 将表单元素数组或者对象序列化
     * @example
```js
$('form').serialize();
// golang=456&name=mdui&password=
```
     */
    serialize(): string;
  }
}

/**
 * 将表单元素或对象序列化
 * @returns {String}
 */
$.fn.serialize = function(this: JQ): string {
  const result: string[] = [];

  each(this.serializeArray(), (_, item) => {
    result.push(
      `${encodeURIComponent(item.name)}=${encodeURIComponent(item.value)}`,
    );
  });

  return result.join('&');
};
