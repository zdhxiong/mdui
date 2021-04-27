import { eachObject } from '@mdui/shared/helpers.js';
import $ from '../$.js';
import { JQ } from '../shared/core.js';
import {
  EventParams,
  GlobalCallback,
  GlobalSuccessCallback,
  ajaxEvents,
} from '../shared/ajax.js';
import './on.js';

declare module '../shared/core.js' {
  interface JQ {
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

eachObject(ajaxEvents, (name, eventName) => {
  $.fn[name] = function (
    this: JQ,
    fn: GlobalCallback | GlobalSuccessCallback,
  ): JQ {
    return this.on(eventName, (e, params) => {
      fn(
        e,
        (params as EventParams).xhr,
        (params as EventParams).options,
        (params as EventParams).data,
      );
    });
  };
});
