import $ from '../$';
import AjaxOptions from '../interfaces/AjaxOptions';
import '../methods/trigger';
import {
  CallbackName,
  ErrorCallback,
  ErrorTextStatus,
  EventName,
  StatusCodeCallbacks,
  SuccessCallback,
  SuccessTextStatus,
  TextStatus,
} from '../types/JQAjax';
import { isString, isUndefined } from '../utils';
import each from './each';
import extend from './extend';
import param from './param';
import { ajaxEvents, globalOptions } from './utils/ajax';

interface EventParams {
  data?: string;
  xhr?: XMLHttpRequest;
  options?: AjaxOptions;
}

/**
 * 判断此请求方法是否通过查询字符串提交参数
 * @param method 请求方法，大写
 */
function isQueryStringData(method: string): boolean {
  return ['GET', 'HEAD'].indexOf(method) >= 0;
}

/**
 * 添加参数到 URL 上，且 URL 中不存在 ? 时，自动把第一个 & 替换为 ?
 * @param url
 * @param query
 */
function appendQuery(url: string, query: string): string {
  return `${url}&${query}`.replace(/[&?]{1,2}/, '?');
}

/**
 * 合并请求参数，参数优先级：options > globalOptions > defaults
 * @param options
 */
function mergeOptions(options: AjaxOptions): AjaxOptions {
  // 默认参数
  const defaults: AjaxOptions = {
    url: '',
    method: 'GET',
    data: '',
    processData: true,
    async: true,
    cache: true,
    username: '',
    password: '',
    headers: {},
    xhrFields: {},
    statusCode: {},
    dataType: 'text',
    contentType: 'application/x-www-form-urlencoded',
    timeout: 0,
    global: true,
  };

  // globalOptions 中的回调函数不合并
  each(globalOptions, (key, value) => {
    const callbacks: (CallbackName | 'statusCode')[] = [
      'beforeSend',
      'success',
      'error',
      'complete',
      'statusCode',
    ];

    // @ts-ignore
    if (callbacks.indexOf(key) < 0 && !isUndefined(value)) {
      defaults[key] = value;
    }
  });

  return extend({}, defaults, options);
}

/**
 * 发送 ajax 请求
 * @param options
 * @example
```js
ajax({
  method: "POST",
  url: "some.php",
  data: { name: "John", location: "Boston" }
}).then(function( msg ) {
  alert( "Data Saved: " + msg );
});
```
 */
function ajax(options: AjaxOptions): Promise<any> {
  // 是否已取消请求
  let isCanceled = false;

  // 事件参数
  const eventParams: EventParams = {};

  // 参数合并
  const mergedOptions = mergeOptions(options);

  let url = mergedOptions.url! || window.location.toString();
  const method = mergedOptions.method!.toUpperCase();
  let data = mergedOptions.data!;
  const processData = mergedOptions.processData!;
  const async = mergedOptions.async!;
  const cache = mergedOptions.cache!;
  const username = mergedOptions.username!;
  const password = mergedOptions.password!;
  const headers = mergedOptions.headers!;
  const xhrFields = mergedOptions.xhrFields!;
  const statusCode = mergedOptions.statusCode!;
  const dataType = mergedOptions.dataType!;
  const contentType = mergedOptions.contentType!;
  const timeout = mergedOptions.timeout!;
  const global = mergedOptions.global!;

  // 需要发送的数据
  // GET/HEAD 请求和 processData 为 true 时，转换为查询字符串格式，特殊格式不转换
  if (
    data &&
    (isQueryStringData(method) || processData) &&
    !isString(data) &&
    !(data instanceof ArrayBuffer) &&
    !(data instanceof Blob) &&
    !(data instanceof Document) &&
    !(data instanceof FormData)
  ) {
    data = param(data);
  }

  // 对于 GET、HEAD 类型的请求，把 data 数据添加到 URL 中
  if (data && isQueryStringData(method)) {
    // 查询字符串拼接到 URL 中
    url = appendQuery(url, data);
    data = null;
  }

  /**
   * 触发事件和回调函数
   * @param event
   * @param params
   * @param callback
   * @param args
   */
  function trigger(
    event: EventName,
    params: EventParams,
    callback: CallbackName,
    ...args: any[]
  ): void {
    // 触发全局事件
    if (global) {
      $(document).trigger(event, params);
    }

    // 触发 ajax 回调和事件
    let result1;
    let result2;

    if (callback) {
      // 全局回调
      if (callback in globalOptions) {
        // @ts-ignore
        result1 = globalOptions[callback](...args);
      }

      // 自定义回调
      if (mergedOptions[callback]) {
        // @ts-ignore
        result2 = mergedOptions[callback](...args);
      }

      // beforeSend 回调返回 false 时取消 ajax 请求
      if (
        callback === 'beforeSend' &&
        (result1 === false || result2 === false)
      ) {
        isCanceled = true;
      }
    }
  }

  // XMLHttpRequest 请求
  function XHR(): Promise<any> {
    let textStatus: TextStatus;

    return new Promise((resolve, reject): void => {
      // GET/HEAD 请求的缓存处理
      if (isQueryStringData(method) && !cache) {
        url = appendQuery(url, `_=${Date.now()}`);
      }

      // 创建 XHR
      const xhr = new XMLHttpRequest();

      xhr.open(method, url, async, username, password);

      if (
        contentType ||
        (data && !isQueryStringData(method) && contentType !== false)
      ) {
        xhr.setRequestHeader('Content-Type', contentType);
      }

      // 设置 Accept
      if (dataType === 'json') {
        xhr.setRequestHeader('Accept', 'application/json, text/javascript');
      }

      // 添加 headers
      if (headers) {
        each(headers, (key: string, value) => {
          // undefined 值不发送，string 和 null 需要发送
          if (!isUndefined(value)) {
            xhr.setRequestHeader(key, value + ''); // 把 null 转换成字符串
          }
        });
      }

      // 检查是否是跨域请求，跨域请求时不添加 X-Requested-With
      const crossDomain =
        /^([\w-]+:)?\/\/([^/]+)/.test(url) &&
        RegExp.$2 !== window.location.host;

      if (!crossDomain) {
        xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
      }

      if (xhrFields) {
        each(xhrFields, (key, value) => {
          // @ts-ignore
          xhr[key] = value;
        });
      }

      eventParams.xhr = xhr;
      eventParams.options = mergedOptions;

      let xhrTimeout: any;

      xhr.onload = function (): void {
        if (xhrTimeout) {
          clearTimeout(xhrTimeout);
        }

        // AJAX 返回的 HTTP 响应码是否表示成功
        const isHttpStatusSuccess =
          (xhr.status >= 200 && xhr.status < 300) ||
          xhr.status === 304 ||
          xhr.status === 0;

        let responseData: any;

        if (isHttpStatusSuccess) {
          if (xhr.status === 204 || method === 'HEAD') {
            textStatus = 'nocontent';
          } else if (xhr.status === 304) {
            textStatus = 'notmodified';
          } else {
            textStatus = 'success';
          }

          if (dataType === 'json') {
            try {
              responseData =
                method === 'HEAD' ? undefined : JSON.parse(xhr.responseText);
              eventParams.data = responseData;
            } catch (err) {
              textStatus = 'parsererror';

              trigger(
                ajaxEvents.ajaxError,
                eventParams,
                'error',
                xhr,
                textStatus,
              );

              reject(new Error(textStatus));
            }

            if (textStatus !== 'parsererror') {
              trigger(
                ajaxEvents.ajaxSuccess,
                eventParams,
                'success',
                responseData,
                textStatus,
                xhr,
              );

              resolve(responseData);
            }
          } else {
            responseData =
              method === 'HEAD'
                ? undefined
                : xhr.responseType === 'text' || xhr.responseType === ''
                ? xhr.responseText
                : xhr.response;
            eventParams.data = responseData;

            trigger(
              ajaxEvents.ajaxSuccess,
              eventParams,
              'success',
              responseData,
              textStatus,
              xhr,
            );

            resolve(responseData);
          }
        } else {
          textStatus = 'error';

          trigger(ajaxEvents.ajaxError, eventParams, 'error', xhr, textStatus);

          reject(new Error(textStatus));
        }

        // statusCode
        each(
          [globalOptions.statusCode!, statusCode],
          (_, func: StatusCodeCallbacks) => {
            if (func && func[xhr.status]) {
              if (isHttpStatusSuccess) {
                (func[xhr.status] as SuccessCallback)(
                  responseData,
                  textStatus as SuccessTextStatus,
                  xhr,
                );
              } else {
                (func[xhr.status] as ErrorCallback)(
                  xhr,
                  textStatus as ErrorTextStatus,
                );
              }
            }
          },
        );

        trigger(
          ajaxEvents.ajaxComplete,
          eventParams,
          'complete',
          xhr,
          textStatus,
        );
      };

      xhr.onerror = function (): void {
        if (xhrTimeout) {
          clearTimeout(xhrTimeout);
        }

        trigger(
          ajaxEvents.ajaxError,
          eventParams,
          'error',
          xhr,
          xhr.statusText,
        );
        trigger(ajaxEvents.ajaxComplete, eventParams, 'complete', xhr, 'error');

        reject(new Error(xhr.statusText));
      };

      xhr.onabort = function (): void {
        let statusText: ErrorTextStatus = 'abort';

        if (xhrTimeout) {
          statusText = 'timeout';
          clearTimeout(xhrTimeout);
        }

        trigger(ajaxEvents.ajaxError, eventParams, 'error', xhr, statusText);
        trigger(
          ajaxEvents.ajaxComplete,
          eventParams,
          'complete',
          xhr,
          statusText,
        );

        reject(new Error(statusText));
      };

      // ajax start 回调
      trigger(ajaxEvents.ajaxStart, eventParams, 'beforeSend', xhr);

      if (isCanceled) {
        reject(new Error('cancel'));

        return;
      }

      // Timeout
      if (timeout > 0) {
        xhrTimeout = setTimeout(() => {
          xhr.abort();
        }, timeout);
      }

      // 发送 XHR
      xhr.send(data);
    });
  }

  return XHR();
}

export default ajax;
