// import 'promise-polyfill/src/polyfill';
import $ from '../$';
import { isFunction, isString } from '../utils';
import { globalOptions, ajaxEvents } from './utils/ajax';
import each from './each';
import param from './param';
import '../methods/trigger';
import '../methods/remove';
import '../methods/append';

let jsonpID = 0;

// 回调函数
const ajaxCallbacks = {
  beforeSend: 'beforeSend',
  success: 'success',
  error: 'error',
  complete: 'complete',
};

// 回调函数名
const callbackNames = [
  ajaxCallbacks.beforeSend,
  ajaxCallbacks.success,
  ajaxCallbacks.error,
  ajaxCallbacks.complete,
  'statusCode',
];

/**
 * 判断此请求方法是否通过查询字符串提交参数
 * @param method 请求方法，大写
 * @returns {boolean}
 */
function isQueryStringData(method) {
  return ['GET', 'HEAD'].indexOf(method) >= 0;
}

/**
 * 添加参数到 URL 上，且 URL 中不存在 ? 时，自动把第一个 & 替换为 ?
 * @param url
 * @param query 参数 key=value
 * @returns {string}
 */
function appendQuery(url, query) {
  return (`${url}&${query}`).replace(/[&?]{1,2}/, '?');
}

/**
 * 发送 ajax 请求
 * @param options
 */
export default function ajax(options) {
  // 配置参数
  const defaults = {
    method: 'GET', // 请求方式
    data: false, // 请求的数据，查询字符串或对象
    processData: true, // 是否把数据转换为查询字符串发送，为 false 时不进行自动转换。
    async: true, // 是否为异步请求
    cache: true, // 是否从缓存中读取，只对 GET/HEAD 请求有效，dataType 为 jsonp 时为 false
    username: '', // HTTP 访问认证的用户名
    password: '', // HTTP 访问认证的密码
    headers: {}, // 一个键值对，随着请求一起发送
    xhrFields: {}, // 设置 XHR 对象
    statusCode: {}, // 一个 HTTP 代码和函数的对象
    dataType: 'text', // 预期服务器返回的数据类型 text、json、jsonp
    timeout: 0, // 设置请求超时时间（毫秒）
    global: true, // 是否在 document 上触发全局 ajax 事件
    contentType: 'application/x-www-form-urlencoded', // 发送信息至服务器时内容编码类型
    jsonp: 'callback', // jsonp 请求的回调函数名称
    jsonpCallback: () => { // （string 或 Function）使用指定的回调函数名代替自动生成的回调函数名
      jsonpID += 1;

      return `mduijsonp_${Date.now()}_${jsonpID}`;
    },
    // beforeSend:  function (XMLHttpRequest) 请求发送前执行，返回 false 可取消本次 ajax 请求
    // success:     function (data, statusText, XMLHttpRequest) 请求成功时调用
    // error:       function (XMLHttpRequest, statusText) 请求失败时调用
    // statusCode:  {404: function ()}
    //              200-299之间的状态码表示成功，参数和 success 回调一样；其他状态码表示失败，参数和 error 回调一样
    // complete:    function (XMLHttpRequest, statusText) 请求完成后回调函数 (请求成功或失败之后均调用)
  };

  // 是否已取消请求
  let isCanceled = false;

  // 保存全局配置
  const globals = globalOptions;

  // 事件参数
  const eventParams = {};

  // 合并全局参数到默认参数，全局回调函数不覆盖
  each(globals, (key, value) => {
    if (callbackNames.indexOf(key) < 0) {
      defaults[key] = value;
    }
  });

  // 参数合并
  options = $.extend({}, defaults, options);

  /**
   * 触发全局事件
   * @param event string 事件名
   * @param xhr XMLHttpRequest 事件参数
   */
  function triggerEvent(event, xhr) {
    if (options.global) {
      $(document).trigger(event, xhr);
    }
  }

  /**
   * 触发 XHR 回调和事件
   * @param callback string 回调函数名称
   * @param args
   */
  function triggerCallback(callback, ...args) {
    let result1;
    let result2;

    if (callback) {
      // 全局回调
      if (callback in globals) {
        result1 = globals[callback](...args);
      }

      // 自定义回调
      if (options[callback]) {
        result2 = options[callback](...args);
      }

      // beforeSend 回调返回 false 时取消 ajax 请求
      if (callback === ajaxCallbacks.beforeSend && (result1 === false || result2 === false)) {
        isCanceled = true;
      }
    }
  }

  // 请求方式转为大写
  const method = options.method.toUpperCase();

  // 默认使用当前页面 URL
  if (!options.url) {
    options.url = window.location.toString();
  }

  // 需要发送的数据
  // GET/HEAD 请求和 processData 为 true 时，转换为查询字符串格式，特殊格式不转换
  let sendData = options.data;
  if (
    (isQueryStringData(method) || options.processData)
    && options.data
    && !isString(options.data)
    && [ArrayBuffer, Blob, Document, FormData].indexOf(options.data.constructor) < 0
  ) {
    sendData = param(options.data);
  }

  // 对于 GET、HEAD 类型的请求，把 data 数据添加到 URL 中
  if (isQueryStringData(method) && sendData) {
    // 查询字符串拼接到 URL 中
    options.url = appendQuery(options.url, sendData);
    sendData = null;
  }

  // JSONP 请求
  function JSONP() {
    return new Promise((resolve, reject) => {
      // URL 中添加自动生成的回调函数名
      const callbackName = isFunction(options.jsonpCallback)
        ? options.jsonpCallback()
        : options.jsonpCallback;
      const requestUrl = appendQuery(options.url, `${options.jsonp}=${callbackName}`);

      eventParams.options = options;

      triggerEvent(ajaxEvents.ajaxStart, eventParams);
      triggerCallback(ajaxCallbacks.beforeSend, null);

      if (isCanceled) {
        reject(new Error('cancel'));

        return undefined;
      }

      let abortTimeout;

      // 创建 script
      let script = document.createElement('script');
      script.type = 'text/javascript';

      // 创建 script 失败
      script.onerror = function () {
        if (abortTimeout) {
          clearTimeout(abortTimeout);
        }

        const statusText = 'scripterror';

        triggerEvent(ajaxEvents.ajaxError, eventParams);
        triggerCallback(ajaxCallbacks.error, null, statusText);

        triggerEvent(ajaxEvents.ajaxComplete, eventParams);
        triggerCallback(ajaxCallbacks.complete, null, statusText);

        reject(new Error(statusText));
      };

      script.src = requestUrl;

      // 处理
      window[callbackName] = function (data) {
        if (abortTimeout) {
          clearTimeout(abortTimeout);
        }

        eventParams.data = data;

        triggerEvent(ajaxEvents.ajaxSuccess, eventParams);
        triggerCallback(ajaxCallbacks.success, data, 'success', null);

        $(script).remove();
        script = null;
        delete window[callbackName];

        resolve(data);
      };

      $('head').append(script);

      if (options.timeout > 0) {
        abortTimeout = setTimeout(() => {
          $(script).remove();
          script = null;

          const statusText = 'timeout';

          triggerEvent(ajaxEvents.ajaxError, eventParams);
          triggerCallback(ajaxCallbacks.error, null, statusText);

          reject(new Error(statusText));
        }, options.timeout);
      }

      return undefined;
    });
  }

  // XMLHttpRequest 请求
  function XHR() {
    return new Promise((resolve, reject) => {
      // GET/HEAD 请求的缓存处理
      if (isQueryStringData(method) && !options.cache) {
        options.url = appendQuery(options.url, `_=${Date.now()}`);
      }

      // 创建 XHR
      const xhr = new XMLHttpRequest();

      xhr.open(method, options.url, options.async, options.username, options.password);

      if (
        options.contentType
        || (sendData && !isQueryStringData(method) && options.contentType !== false)
      ) {
        xhr.setRequestHeader('Content-Type', options.contentType);
      }

      // 设置 Accept
      if (options.dataType === 'json') {
        xhr.setRequestHeader('Accept', 'application/json, text/javascript');
      }

      // 添加 headers
      if (options.headers) {
        each(options.headers, (key, value) => {
          xhr.setRequestHeader(key, value);
        });
      }

      // 检查是否是跨域请求
      if (options.crossDomain === undefined) {
        options.crossDomain = /^([\w-]+:)?\/\/([^/]+)/.test(options.url) && RegExp.$2 !== window.location.host;
      }

      if (!options.crossDomain) {
        xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
      }

      if (options.xhrFields) {
        each(options.xhrFields, (key, value) => {
          xhr[key] = value;
        });
      }

      eventParams.xhr = xhr;
      eventParams.options = options;

      let xhrTimeout;

      xhr.onload = function () {
        if (xhrTimeout) {
          clearTimeout(xhrTimeout);
        }

        // 包含成功或错误代码的字符串
        let statusText;

        // AJAX 返回的 HTTP 响应码是否表示成功
        const isHttpStatusSuccess = (xhr.status >= 200 && xhr.status < 300) || xhr.status === 0;

        let responseData;

        if (isHttpStatusSuccess) {
          if (xhr.status === 204 || method === 'HEAD') {
            statusText = 'nocontent';
          } else if (xhr.status === 304) {
            statusText = 'notmodified';
          } else {
            statusText = 'success';
          }

          if (options.dataType === 'json') {
            try {
              responseData = JSON.parse(xhr.responseText);
              eventParams.data = responseData;
            } catch (err) {
              statusText = 'parsererror';

              triggerEvent(ajaxEvents.ajaxError, eventParams);
              triggerCallback(ajaxCallbacks.error, xhr, statusText);

              reject(new Error(statusText));
            }

            if (statusText !== 'parsererror') {
              triggerEvent(ajaxEvents.ajaxSuccess, eventParams);
              triggerCallback(ajaxCallbacks.success, responseData, statusText, xhr);

              resolve(responseData);
            }
          } else {
            responseData = xhr.responseType === 'text' || xhr.responseType === ''
              ? xhr.responseText
              : xhr.response;
            eventParams.data = responseData;

            triggerEvent(ajaxEvents.ajaxSuccess, eventParams);
            triggerCallback(ajaxCallbacks.success, responseData, statusText, xhr);

            resolve(responseData);
          }
        } else {
          statusText = 'error';

          triggerEvent(ajaxEvents.ajaxError, eventParams);
          triggerCallback(ajaxCallbacks.error, xhr, statusText);

          reject(new Error(statusText));
        }

        // statusCode
        each([globals.statusCode, options.statusCode], (i, func) => {
          if (func && func[xhr.status]) {
            if (isHttpStatusSuccess) {
              func[xhr.status](responseData, statusText, xhr);
            } else {
              func[xhr.status](xhr, statusText);
            }
          }
        });

        triggerEvent(ajaxEvents.ajaxComplete, eventParams);
        triggerCallback(ajaxCallbacks.complete, xhr, statusText);
      };

      xhr.onerror = function () {
        if (xhrTimeout) {
          clearTimeout(xhrTimeout);
        }

        triggerEvent(ajaxEvents.ajaxError, eventParams);
        triggerCallback(ajaxCallbacks.error, xhr, xhr.statusText);

        triggerEvent(ajaxEvents.ajaxComplete, eventParams);
        triggerCallback(ajaxCallbacks.complete, xhr, 'error');

        reject(new Error(xhr.statusText));
      };

      xhr.onabort = function () {
        let statusText = 'abort';

        if (xhrTimeout) {
          statusText = 'timeout';
          clearTimeout(xhrTimeout);
        }

        triggerEvent(ajaxEvents.ajaxError, eventParams);
        triggerCallback(ajaxCallbacks.error, xhr, statusText);

        triggerEvent(ajaxEvents.ajaxComplete, eventParams);
        triggerCallback(ajaxCallbacks.complete, xhr, statusText);

        reject(new Error(statusText));
      };

      // ajax start 回调
      triggerEvent(ajaxEvents.ajaxStart, eventParams);
      triggerCallback(ajaxCallbacks.beforeSend, xhr);

      if (isCanceled) {
        reject(new Error('cancel'));

        return undefined;
      }

      // Timeout
      if (options.timeout > 0) {
        xhrTimeout = setTimeout(() => {
          xhr.abort();
        }, options.timeout);
      }

      // 发送 XHR
      xhr.send(sendData);

      return undefined;
    });
  }

  return options.dataType === 'jsonp' ? JSONP() : XHR();
}
