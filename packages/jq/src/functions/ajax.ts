import $ from '../$';
import AjaxOptions from '../interfaces/AjaxOptions';
import each from './each';
import extend from './extend';
import param from './param';
import { isFunction, isString, isUndefined } from '../utils';
import { ajaxEvents, globalOptions } from './utils/ajax';
import '../methods/trigger';
import '../methods/remove';
import '../methods/append';
import {
  CallbackName,
  ErrorCallback,
  ErrorTextStatus,
  EventName,
  StatusCodeCallbacks,
  SuccessCallback,
  SuccessTextStatus,
} from '../types/JQAjax';

interface EventParams {
  data?: string;
  xhr?: XMLHttpRequest;
  options?: AjaxOptions;
}

let jsonpID = 0;

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
 * 获取 jsonp 请求的回调函数名称
 */
function defaultJsonpCallback(): string {
  jsonpID += 1;

  return `mduijsonp_${Date.now()}_${jsonpID}`;
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
    jsonp: 'callback',
    jsonpCallback: defaultJsonpCallback,
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
    if (callbacks.indexOf(key) < 0) {
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
  const jsonp = mergedOptions.jsonp!;
  const jsonpCallback = mergedOptions.jsonpCallback!;
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
  if (isQueryStringData(method) && data) {
    // 查询字符串拼接到 URL 中
    url = appendQuery(url, data);
    data = null;
  }

  /**
   * 触发全局事件
   * @param event 事件名
   * @param params 事件参数
   */
  function triggerEvent(event: EventName, params: EventParams): void {
    if (global) {
      $(document).trigger(event, params);
    }
  }

  /**
   * 触发 XHR 回调和事件
   * @param callback 回调函数名称
   * @param args
   */
  function triggerCallback(callback: CallbackName, ...args: any[]): void {
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

  // JSONP 请求
  function JSONP(): Promise<any> {
    let textStatus: SuccessTextStatus | ErrorTextStatus;

    return new Promise((resolve, reject): void => {
      // URL 中添加自动生成的回调函数名
      const callbackName = isFunction(jsonpCallback)
        ? jsonpCallback()
        : jsonpCallback;

      const requestUrl = appendQuery(url, `${jsonp}=${callbackName}`);

      eventParams.options = mergedOptions;

      triggerEvent(ajaxEvents.ajaxStart, eventParams);
      triggerCallback('beforeSend', null);

      if (isCanceled) {
        reject(new Error('cancel'));

        return;
      }

      let abortTimeout: any;

      // 创建 script
      let script: HTMLScriptElement | null = document.createElement('script');
      script.type = 'text/javascript';

      // 创建 script 失败
      script.onerror = function(): void {
        if (abortTimeout) {
          clearTimeout(abortTimeout);
        }

        textStatus = 'error';

        triggerEvent(ajaxEvents.ajaxError, eventParams);
        triggerCallback('error', null, textStatus);

        triggerEvent(ajaxEvents.ajaxComplete, eventParams);
        triggerCallback('complete', null, textStatus);

        reject(new Error(textStatus));
      };

      script.src = requestUrl;

      // 处理
      // @ts-ignore
      window[callbackName] = function(data: string): void {
        if (abortTimeout) {
          clearTimeout(abortTimeout);
        }

        textStatus = 'success';
        eventParams.data = data;

        triggerEvent(ajaxEvents.ajaxSuccess, eventParams);
        triggerCallback('success', data, textStatus, null);

        $(script).remove();
        script = null;
        delete window[callbackName];

        resolve(data);
      };

      $('head').append(script);

      if (timeout > 0) {
        abortTimeout = setTimeout(() => {
          $(script).remove();
          script = null;

          textStatus = 'timeout';

          triggerEvent(ajaxEvents.ajaxError, eventParams);
          triggerCallback('error', null, textStatus);

          reject(new Error(textStatus));
        }, timeout);
      }

      return;
    });
  }

  // XMLHttpRequest 请求
  function XHR(): Promise<any> {
    let textStatus: SuccessTextStatus | ErrorTextStatus;

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

      xhr.onload = function(): void {
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
              responseData = JSON.parse(xhr.responseText);
              eventParams.data = responseData;
            } catch (err) {
              textStatus = 'parsererror';

              triggerEvent(ajaxEvents.ajaxError, eventParams);
              triggerCallback('error', xhr, textStatus);

              reject(new Error(textStatus));
            }

            if (textStatus !== 'parsererror') {
              triggerEvent(ajaxEvents.ajaxSuccess, eventParams);
              triggerCallback('success', responseData, textStatus, xhr);

              resolve(responseData);
            }
          } else {
            responseData =
              xhr.responseType === 'text' || xhr.responseType === ''
                ? xhr.responseText
                : xhr.response;
            eventParams.data = responseData;

            triggerEvent(ajaxEvents.ajaxSuccess, eventParams);
            triggerCallback('success', responseData, textStatus, xhr);

            resolve(responseData);
          }
        } else {
          textStatus = 'error';

          triggerEvent(ajaxEvents.ajaxError, eventParams);
          triggerCallback('error', xhr, textStatus);

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

        triggerEvent(ajaxEvents.ajaxComplete, eventParams);
        triggerCallback('complete', xhr, textStatus);
      };

      xhr.onerror = function(): void {
        if (xhrTimeout) {
          clearTimeout(xhrTimeout);
        }

        triggerEvent(ajaxEvents.ajaxError, eventParams);
        triggerCallback('error', xhr, xhr.statusText);

        triggerEvent(ajaxEvents.ajaxComplete, eventParams);
        triggerCallback('complete', xhr, 'error');

        reject(new Error(xhr.statusText));
      };

      xhr.onabort = function(): void {
        let statusText: ErrorTextStatus = 'abort';

        if (xhrTimeout) {
          statusText = 'timeout';
          clearTimeout(xhrTimeout);
        }

        triggerEvent(ajaxEvents.ajaxError, eventParams);
        triggerCallback('error', xhr, statusText);

        triggerEvent(ajaxEvents.ajaxComplete, eventParams);
        triggerCallback('complete', xhr, statusText);

        reject(new Error(statusText));
      };

      // ajax start 回调
      triggerEvent(ajaxEvents.ajaxStart, eventParams);
      triggerCallback('beforeSend', xhr);

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

  return dataType === 'jsonp' ? JSONP() : XHR();
}

export default ajax;
