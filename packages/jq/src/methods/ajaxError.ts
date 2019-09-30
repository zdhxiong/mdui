import { GlobalCallback } from '../types/JQAjax';
import './ajaxStart';

declare module '../JQ' {
  interface JQ<T = HTMLElement> {
    /**
     * 监听全局 Ajax 完成事件
     * 通过 $(document).on('error.mdui.ajax', function (event, params) {}) 调用时，包含两个参数
     * event: 事件对象
     * params: {
     *   xhr: XMLHttpRequest 对象
     *   options: ajax 请求的配置参数
     * }
     * @param handler
     * @example
```js
$(document).ajaxError(function (event, xhr, options) {});
```
     */
    ajaxError(handler: GlobalCallback): this;
  }
}
