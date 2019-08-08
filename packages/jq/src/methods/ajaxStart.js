import $ from '../$';
import each from '../functions/each';
import { ajaxEvents } from '../functions/utils/ajax';
import './on';

// 监听全局事件
//
// 通过 $(document).on('success.mdui.ajax', function (event, params) {}) 调用时，包含两个参数
// event: 事件对象
// params: {
//   xhr: XMLHttpRequest 对象
//   options: ajax 请求的配置参数
//   data: ajax 请求返回的数据
// }

// 全局 Ajax 事件快捷方法
// $(document).ajaxStart(function (event, xhr, options) {})
// $(document).ajaxSuccess(function (event, xhr, options, data) {})
// $(document).ajaxError(function (event, xhr, options) {})
// $(document).ajaxComplete(function (event, xhr, options) {})
each(ajaxEvents, (name, eventName) => {
  $.fn[name] = function (fn) {
    return this.on(eventName, (e, params) => {
      fn(e, params.xhr, params.options, params.data);
    });
  };
});
