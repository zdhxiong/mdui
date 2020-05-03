import $ from '../$';
import each from '../functions/each';
import { ajaxEvents } from '../functions/utils/ajax';
import { JQ } from '../JQ';
import { GlobalCallback, GlobalSuccessCallback } from '../types/JQAjax';
import './on';

declare module '../JQ' {
  interface JQ<T = HTMLElement> {
    /**
     * 监听全局 Ajax 开始事件
     * 通过 $(document).on('start.mdui.ajax', function (event, params) {}) 调用时，包含两个参数
     * event: 事件对象
     * params: {
     *   xhr: XMLHttpRequest 对象
     *   options: ajax 请求的配置参数
     * }
     * @param handler
     * @example
```js
$(document).ajaxStart(function (event, xhr, options) {});
```
     */
    ajaxStart(handler: GlobalCallback): this;
  }
}

each(ajaxEvents, (name, eventName) => {
  $.fn[name] = function (
    this: JQ,
    fn: GlobalCallback | GlobalSuccessCallback,
  ): any {
    return this.on(eventName, (e, params) => {
      fn(e, params.xhr, params.options, params.data);
    });
  };
});
