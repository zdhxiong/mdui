(function () {
  var globalOptions = {};
  var jsonpID = 0;

  // 全局事件名
  var ajaxEvent = {
    ajaxStart: 'start.mdui.ajax',
    ajaxSuccess: 'success.mdui.ajax',
    ajaxError: 'error.mdui.ajax',
    ajaxComplete: 'complete.mdui.ajax',
  };

  /**
   * 判断此请求方法是否通过查询字符串提交参数
   * @param method 请求方法，大写
   * @returns {boolean}
   */
  var isQueryStringData = function (method) {
    return ['GET', 'HEAD'].indexOf(method) >= 0;
  };

  /**
   * 添加参数到 URL 上，且 URL 中不存在 ? 时，自动把第一个 & 替换为 ?
   * @param url
   * @param query 参数 key=value
   * @returns {string}
   */
  var appendQuery = function (url, query) {
    return (url + '&' + query).replace(/[&?]{1,2}/, '?');
  };

  $.extend({

    /**
     * 为 ajax 请求设置全局配置参数
     * @param options
     */
    ajaxSetup: function (options) {
      $.extend(globalOptions, options || {});
    },

    /**
     * 发送 ajax 请求
     * @param options
     */
    ajax: function (options) {

      // 配置参数
      var defaults = {
        method: 'GET',         // 请求方式
        data: false,           // 请求的数据，查询字符串或对象
        processData: true,     // 是否把数据转换为查询字符串发送，为 false 时不进行自动转换。
        async: true,           // 是否为异步请求
        cache: true,           // 是否从缓存中读取，只对 GET/HEAD 请求有效，dataType 为 jsonp 时为 false
        username: '',          // HTTP 访问认证的用户名
        password: '',          // HTTP 访问认证的密码
        headers: {},           // 一个键值对，随着请求一起发送
        xhrFields: {},         // 设置 XHR 对象
        statusCode: {},        // 一个 HTTP 代码和函数的对象
        dataType: 'text',      // 预期服务器返回的数据类型 text、json、jsonp
        jsonp: 'callback',     // jsonp 请求的回调函数名称
        jsonpCallback: function () {  // （string 或 Function）使用指定的回调函数名代替自动生成的回调函数名
          return 'mduijsonp_' + Date.now() + '_' + (jsonpID += 1);
        },

        contentType: 'application/x-www-form-urlencoded', // 发送信息至服务器时内容编码类型
        timeout: 0,            // 设置请求超时时间（毫秒）
        global: true,          // 是否在 document 上触发全局 ajax 事件
        // beforeSend:    function (XMLHttpRequest) 请求发送前执行，返回 false 可取消本次 ajax 请求
        // success:       function (data, textStatus, XMLHttpRequest) 请求成功时调用
        // error:         function (XMLHttpRequest, textStatus) 请求失败时调用
        // statusCode:    {404: function ()}
        //                200-299之间的状态码表示成功，参数和 success 回调一样；其他状态码表示失败，参数和 error 回调一样
        // complete:      function (XMLHttpRequest, textStatus) 请求完成后回调函数 (请求成功或失败之后均调用)
      };

      // 回调函数
      var callbacks = [
        'beforeSend',
        'success',
        'error',
        'statusCode',
        'complete',
      ];

      // 是否已取消请求
      var isCanceled = false;

      // 保存全局配置
      var globals = globalOptions;

      // 事件参数
      var eventParams = {};

      // 合并全局参数到默认参数，全局回调函数不覆盖
      each(globals, function (key, value) {
        if (callbacks.indexOf(key) < 0) {
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
       */
      function triggerCallback(callback) {
        var a = arguments;
        var result1;
        var result2;

        if (callback) {
          // 全局回调
          if (callback in globals) {
            result1 = globals[callback](a[1], a[2], a[3], a[4]);
          }

          // 自定义回调
          if (options[callback]) {
            result2 = options[callback](a[1], a[2], a[3], a[4]);
          }

          // beforeSend 回调返回 false 时取消 ajax 请求
          if (callback === 'beforeSend' && (result1 === false || result2 === false)) {
            isCanceled = true;
          }
        }
      }

      // 请求方式转为大写
      var method = options.method = options.method.toUpperCase();

      // 默认使用当前页面 URL
      if (!options.url) {
        options.url = window.location.toString();
      }

      // 需要发送的数据
      // GET/HEAD 请求和 processData 为 true 时，转换为查询字符串格式，特殊格式不转换
      var sendData;
      if (
        (isQueryStringData(method) || options.processData) &&
        options.data &&
        [ArrayBuffer, Blob, Document, FormData].indexOf(options.data.constructor) < 0
      ) {
        sendData = isString(options.data) ? options.data : $.param(options.data);
      } else {
        sendData = options.data;
      }

      // 对于 GET、HEAD 类型的请求，把 data 数据添加到 URL 中
      if (isQueryStringData(method) && sendData) {
        // 查询字符串拼接到 URL 中
        options.url = appendQuery(options.url, sendData);
        sendData = null;
      }

      // JSONP
      if (options.dataType === 'jsonp') {
        // URL 中添加自动生成的回调函数名
        var callbackName = isFunction(options.jsonpCallback) ?
          options.jsonpCallback() :
          options.jsonpCallback;
        var requestUrl = appendQuery(options.url, options.jsonp + '=' + callbackName);

        eventParams.options = options;

        triggerEvent(ajaxEvent.ajaxStart, eventParams);
        triggerCallback('beforeSend', null);

        if (isCanceled) {
          return;
        }

        var abortTimeout;

        // 创建 script
        var script = document.createElement('script');
        script.type = 'text/javascript';

        // 创建 script 失败
        script.onerror = function () {
          if (abortTimeout) {
            clearTimeout(abortTimeout);
          }

          triggerEvent(ajaxEvent.ajaxError, eventParams);
          triggerCallback('error', null, 'scripterror');

          triggerEvent(ajaxEvent.ajaxComplete, eventParams);
          triggerCallback('complete', null, 'scripterror');
        };

        script.src = requestUrl;

        // 处理
        window[callbackName] = function (data) {
          if (abortTimeout) {
            clearTimeout(abortTimeout);
          }

          eventParams.data = data;

          triggerEvent(ajaxEvent.ajaxSuccess, eventParams);
          triggerCallback('success', data, 'success', null);

          $(script).remove();
          script = null;
          delete window[callbackName];
        };

        $('head').append(script);

        if (options.timeout > 0) {
          abortTimeout = setTimeout(function () {
            $(script).remove();
            script = null;

            triggerEvent(ajaxEvent.ajaxError, eventParams);
            triggerCallback('error', null, 'timeout');
          }, options.timeout);
        }

        return;
      }

      // GET/HEAD 请求的缓存处理
      if (isQueryStringData(method) && !options.cache) {
        options.url = appendQuery(options.url, '_=' + Date.now());
      }

      // 创建 XHR
      var xhr = new XMLHttpRequest();

      xhr.open(method, options.url, options.async, options.username, options.password);

      if (sendData && !isQueryStringData(method) && options.contentType !== false || options.contentType) {
        xhr.setRequestHeader('Content-Type', options.contentType);
      }

      // 设置 Accept
      if (options.dataType === 'json') {
        xhr.setRequestHeader('Accept', 'application/json, text/javascript');
      }

      // 添加 headers
      if (options.headers) {
        each(options.headers, function (key, value) {
          xhr.setRequestHeader(key, value);
        });
      }

      // 检查是否是跨域请求
      if (options.crossDomain === undefined) {
        options.crossDomain =
          /^([\w-]+:)?\/\/([^\/]+)/.test(options.url) &&
          RegExp.$2 !== window.location.host;
      }

      if (!options.crossDomain) {
        xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
      }

      if (options.xhrFields) {
        each(options.xhrFields, function (key, value) {
          xhr[key] = value;
        });
      }

      eventParams.xhr = xhr;
      eventParams.options = options;

      var xhrTimeout;

      xhr.onload = function () {
        if (xhrTimeout) {
          clearTimeout(xhrTimeout);
        }

        // 包含成功或错误代码的字符串
        var textStatus;

        // AJAX 返回的 HTTP 响应码是否表示成功
        var isHttpStatusSuccess = (xhr.status >= 200 && xhr.status < 300) || xhr.status === 0;

        if (isHttpStatusSuccess) {

          if (xhr.status === 204 || method === 'HEAD') {
            textStatus = 'nocontent';
          } else if (xhr.status === 304) {
            textStatus = 'notmodified';
          } else {
            textStatus = 'success';
          }

          var responseData;
          if (options.dataType === 'json') {
            try {
              eventParams.data = responseData = JSON.parse(xhr.responseText);

              triggerEvent(ajaxEvent.ajaxSuccess, eventParams);
              triggerCallback('success', responseData, textStatus, xhr);
            } catch (err) {
              textStatus = 'parsererror';

              triggerEvent(ajaxEvent.ajaxError, eventParams);
              triggerCallback('error', xhr, textStatus);
            }
          } else {
            eventParams.data = responseData =
              xhr.responseType === 'text' || xhr.responseType === '' ?
              xhr.responseText :
              xhr.response;

            triggerEvent(ajaxEvent.ajaxSuccess, eventParams);
            triggerCallback('success', responseData, textStatus, xhr);
          }
        } else {
          textStatus = 'error';

          triggerEvent(ajaxEvent.ajaxError, eventParams);
          triggerCallback('error', xhr, textStatus);
        }

        // statusCode
        each([globals.statusCode, options.statusCode], function (i, func) {
          if (func && func[xhr.status]) {
            if (isHttpStatusSuccess) {
              func[xhr.status](responseData, textStatus, xhr);
            } else {
              func[xhr.status](xhr, textStatus);
            }
          }
        });

        triggerEvent(ajaxEvent.ajaxComplete, eventParams);
        triggerCallback('complete', xhr, textStatus);
      };

      xhr.onerror = function () {
        if (xhrTimeout) {
          clearTimeout(xhrTimeout);
        }

        triggerEvent(ajaxEvent.ajaxError, eventParams);
        triggerCallback('error', xhr, xhr.statusText);

        triggerEvent(ajaxEvent.ajaxComplete, eventParams);
        triggerCallback('complete', xhr, 'error');
      };

      xhr.onabort = function () {
        var textStatus = 'abort';

        if (xhrTimeout) {
          textStatus = 'timeout';
          clearTimeout(xhrTimeout);
        }

        triggerEvent(ajaxEvent.ajaxError, eventParams);
        triggerCallback('error', xhr, textStatus);

        triggerEvent(ajaxEvent.ajaxComplete, eventParams);
        triggerCallback('complete', xhr, textStatus);
      };

      // ajax start 回调
      triggerEvent(ajaxEvent.ajaxStart, eventParams);
      triggerCallback('beforeSend', xhr);

      if (isCanceled) {
        return xhr;
      }

      // Timeout
      if (options.timeout > 0) {
        xhrTimeout = setTimeout(function () {
          xhr.abort();
        }, options.timeout);
      }

      // 发送 XHR
      xhr.send(sendData);

      return xhr;
    },
  });

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
  each(ajaxEvent, function (name, eventName) {
    $.fn[name] = function (fn) {
      return this.on(eventName, function (e, params) {
        fn(e, params.xhr, params.options, params.data);
      });
    };
  });
})();
