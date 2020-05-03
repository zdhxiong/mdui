import $ from '../$';
import { JQ } from '../JQ';
import './map';

declare module '../JQ' {
  interface JQ<T = HTMLElement> {
    /**
     * 通过深度克隆来复制集合中的所有元素
     *
     * 通过原生 cloneNode 方法深度克隆来复制集合中的所有元素。此方法不会有数据和事件处理程序复制到新的元素。这点和jquery中利用一个参数来确定是否复制数据和事件处理不相同。
     * @example
```js
$('body').append($("#box").clone())
```
     */
    clone(): this;
  }
}

$.fn.clone = function (this: JQ): JQ {
  return this.map(function () {
    return this.cloneNode(true) as HTMLElement;
  });
};
