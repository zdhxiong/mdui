import { assert } from 'chai';
import $ from '../../jq_or_jquery';

const hasPHP = true;
const isLocal = window.location.protocol === 'file:';
const phpPath = 'http://localhost/github/mdui.jq/test/data';

// @ts-ignore
const isJquery = typeof jQuery !== 'undefined';

$.ajaxSetup({
  // 禁止触发全局事件，避免影响全局事件的测试
  global: false,
});

/**
 * 回调函数顺序为 beforeSend -> success|error -> statusCode -> complete
 */

describe('$.ajax', function () {
  it('ajax 测试环境', function () {
    assert.isTrue(hasPHP, '必须安装 PHP 环境才能测试 Ajax');
    assert.isTrue(!isLocal, '必须通过服务器环境访问才能测试 Ajax');
  });

  it('GET 请求，请求成功，返回 text，测试回调函数参数、全局事件、事件触发顺序', function () {
    // 用于测试事件触发顺序
    let eventStart = 0;
    let eventSuccess = 0;
    let eventError = 0;
    let eventComplete = 0;

    // ==============================================
    // 事件监听，这 4 个事件仅支持 mdui.jq，不支持 jQuery
    // ==============================================
    // event: 事件对象
    // params: {
    //   xhr: XMLHttpRequest 对象
    //   options: AJAX 请求的配置参数
    //   data: AJAX 请求返回的数据
    // }
    $(document).on('start.mdui.ajax', function (event, params) {
      assert.instanceOf(params.xhr, XMLHttpRequest);
      // @ts-ignore
      assert.instanceOf(event._detail.xhr, XMLHttpRequest);

      assert.isObject(params.options);
      assert.equal(params.options.method, 'GET');

      assert.equal(params.data, null);

      eventStart++;
      assert.equal(eventStart, 1);
      assert.equal(eventSuccess, 0);
      assert.equal(eventError, 0);
      assert.equal(eventComplete, 0);
    });

    $(document).on('success.mdui.ajax', function (event, params) {
      assert.instanceOf(params.xhr, XMLHttpRequest);
      // @ts-ignore
      assert.instanceOf(event._detail.xhr, XMLHttpRequest);

      assert.isObject(params.options);
      assert.equal(params.options.method, 'GET');

      assert.equal(params.data, 'is a text');

      eventSuccess++;
      assert.equal(eventStart, 1);
      assert.equal(eventSuccess, 1);
      assert.equal(eventError, 0);
      assert.equal(eventComplete, 0);
    });

    $(document).on('error.mdui.ajax', function (event, params) {
      assert.instanceOf(params.xhr, XMLHttpRequest);
      // @ts-ignore
      assert.instanceOf(event._detail.xhr, XMLHttpRequest);

      assert.isObject(params.options);
      assert.equal(params.options.method, 'GET');

      assert.equal(params.data, null);

      eventError++;
    });

    $(document).on('complete.mdui.ajax', function (event, params) {
      assert.instanceOf(params.xhr, XMLHttpRequest);
      // @ts-ignore
      assert.instanceOf(event._detail.xhr, XMLHttpRequest);

      assert.isObject(params.options);
      assert.equal(params.options.method, 'GET');

      assert.equal(params.data, 'is a text');

      eventComplete++;
      assert.equal(eventStart, 1);
      assert.equal(eventSuccess, 1);
      assert.equal(eventError, 0);
      assert.equal(eventComplete, 1);
    });

    // =========================
    // ============== 原生事件监听
    // =========================
    // event: 事件对象
    // event.detail: {
    //   xhr: XMLHttpRequest 对象
    //   options: AJAX 请求的配置参数
    //   data: AJAX 请求返回的数据
    // }
    document.addEventListener('start.mdui.ajax', function (event) {
      // @ts-ignore
      assert.instanceOf(event._detail.xhr, XMLHttpRequest);
    });

    document.addEventListener('success.mdui.ajax', function (event) {
      // @ts-ignore
      assert.instanceOf(event._detail.xhr, XMLHttpRequest);
    });

    document.addEventListener('error.mdui.ajax', function (event) {
      // @ts-ignore
      assert.instanceOf(event._detail.xhr, XMLHttpRequest);
    });

    document.addEventListener('complete.mdui.ajax', function (event) {
      // @ts-ignore
      assert.instanceOf(event._detail.xhr, XMLHttpRequest);
    });

    // ==========================
    // =============事件监听快捷方法
    // ==========================
    // event: 事件对象
    // xhr: XMLHttpRequest 对象
    // options: AJAX 请求的配置参数
    // data: AJAX 请求返回的数据
    // event.detail: {
    //   xhr: XMLHttpRequest 对象
    //   options: AJAX 请求的配置参数
    //   data: AJAX 请求返回的数据
    // }
    $(document).ajaxStart(function (_, xhr, options) {
      if (!isJquery) {
        assert.instanceOf(xhr, XMLHttpRequest);
        assert.isObject(options);
      }
    });

    $(document).ajaxSuccess(function (_, xhr, options, data) {
      if (!isJquery) {
        assert.instanceOf(xhr, XMLHttpRequest);
      }
      assert.isObject(options);
      assert.equal(data, 'is a text');
    });

    $(document).ajaxError(function (_, xhr, options) {
      if (!isJquery) {
        assert.instanceOf(xhr, XMLHttpRequest);
      }
      assert.isObject(options);
    });

    $(document).ajaxComplete(function (_, xhr, options) {
      if (!isJquery) {
        assert.instanceOf(xhr, XMLHttpRequest);
      }
      assert.isObject(options);
    });

    // 用于测试回调函数触发顺序
    let callbackBeforeSend = 0;
    let callbackSuccess = 0;
    let callbackError = 0;
    let callbackComplete = 0;
    let callbackStatusCode404 = 0;
    let callbackStatusCode200 = 0;

    const promise = $.ajax({
      method: 'GET',
      url: './data/get_text.php',
      global: true,
      beforeSend: function (xhr) {
        callbackBeforeSend++;
        assert.equal(callbackBeforeSend, 1);
        assert.equal(callbackSuccess, 0);
        assert.equal(callbackError, 0);
        assert.equal(callbackStatusCode404, 0);
        assert.equal(callbackStatusCode200, 0);
        assert.equal(callbackComplete, 0);

        if (!isJquery) {
          assert.instanceOf(xhr, XMLHttpRequest);
        }
      },
      success: function (data, textStatus, xhr) {
        callbackSuccess++;
        assert.equal(callbackBeforeSend, 1);
        assert.equal(callbackSuccess, 1);
        assert.equal(callbackError, 0);
        assert.equal(callbackStatusCode404, 0);
        assert.equal(callbackStatusCode200, 0);
        assert.equal(callbackComplete, 0);

        assert.equal(data, 'is a text');
        assert.equal(textStatus, 'success');
        if (!isJquery) {
          assert.instanceOf(xhr, XMLHttpRequest);
        }
      },
      error: function () {
        callbackError++;
      },
      statusCode: {
        404: function (): void {
          callbackStatusCode404++;
        },
        200: function (data, textStatus, xhr): void {
          callbackStatusCode200++;
          assert.equal(callbackBeforeSend, 1);
          assert.equal(callbackSuccess, 1);
          assert.equal(callbackError, 0);
          assert.equal(callbackStatusCode404, 0);
          assert.equal(callbackStatusCode200, 1);
          assert.equal(callbackComplete, 0);

          assert.equal(data, 'is a text');
          assert.equal(textStatus, 'success');

          if (!isJquery) {
            assert.instanceOf(xhr, XMLHttpRequest);
          }
        },
      },
      complete: function (xhr, textStatus) {
        callbackComplete++;
        assert.equal(callbackBeforeSend, 1);
        assert.equal(callbackSuccess, 1);
        assert.equal(callbackError, 0);
        assert.equal(callbackStatusCode404, 0);
        assert.equal(callbackStatusCode200, 1);
        assert.equal(callbackComplete, 1);

        if (!isJquery) {
          assert.instanceOf(xhr, XMLHttpRequest);
        }
        assert.equal(textStatus, 'success');
      },
    }).then(function (data) {
      assert.equal(data, 'is a text');
    });
    if (!isJquery) {
      assert.instanceOf(promise, Promise);
    }

    return promise;
  });

  it('GET 请求，请求返回 404，测试回调函数参数，全局事件', function () {
    // 用于测试事件触发顺序
    let eventStart = 0;
    let eventSuccess = 0;
    let eventError = 0;
    let eventComplete = 0;

    // ==============================================
    // 事件监听，这 4 个事件仅支持 mdui.jq，不支持 jQuery
    // ==============================================
    $(document).on('start.mdui.ajax', function () {
      eventStart++;
      assert.equal(eventStart, 1);
      assert.equal(eventSuccess, 0);
      assert.equal(eventError, 0);
      assert.equal(eventComplete, 0);
    });

    $(document).on('success.mdui.ajax', function () {
      eventSuccess++;
    });

    $(document).on('error.mdui.ajax', function () {
      eventError++;
      assert.equal(eventStart, 1);
      assert.equal(eventSuccess, 0);
      assert.equal(eventError, 1);
      assert.equal(eventComplete, 0);
    });

    $(document).on('complete.mdui.ajax', function () {
      eventComplete++;
      assert.equal(eventStart, 1);
      assert.equal(eventSuccess, 0);
      assert.equal(eventError, 1);
      assert.equal(eventComplete, 1);
    });

    // 用于测试回调函数触发顺序
    let callbackBeforeSend = 0;
    let callbackSuccess = 0;
    let callbackError = 0;
    let callbackComplete = 0;
    let callbackStatusCode404 = 0;
    let callbackStatusCode200 = 0;

    return new Promise<void>((resolve, reject) => {
      $.ajax({
        method: 'get',
        url: './data/not_fount.php',
        global: true,
        beforeSend: function () {
          callbackBeforeSend++;
          assert.equal(callbackBeforeSend, 1);
          assert.equal(callbackSuccess, 0);
          assert.equal(callbackError, 0);
          assert.equal(callbackStatusCode404, 0);
          assert.equal(callbackStatusCode200, 0);
          assert.equal(callbackComplete, 0);
        },
        success: function () {
          callbackSuccess++;
          reject('error');
        },
        error: function (xhr, textStatus) {
          callbackError++;
          assert.equal(callbackBeforeSend, 1);
          assert.equal(callbackSuccess, 0);
          assert.equal(callbackError, 1);
          assert.equal(callbackStatusCode404, 0);
          assert.equal(callbackStatusCode200, 0);
          assert.equal(callbackComplete, 0);

          if (!isJquery) {
            assert.instanceOf(xhr, XMLHttpRequest);
          }
          assert.equal(textStatus, 'error');
        },
        statusCode: {
          404: function (xhr): void {
            callbackStatusCode404++;
            assert.equal(callbackBeforeSend, 1);
            assert.equal(callbackSuccess, 0);
            assert.equal(callbackError, 1);
            assert.equal(callbackStatusCode404, 1);
            assert.equal(callbackStatusCode200, 0);
            assert.equal(callbackComplete, 0);

            if (!isJquery && xhr !== null) {
              assert.instanceOf(xhr, XMLHttpRequest);
            }
          },
          200: function (): void {
            callbackStatusCode200++;
          },
        },
        complete: function (xhr, textStatus) {
          callbackComplete++;
          assert.equal(callbackBeforeSend, 1);
          assert.equal(callbackSuccess, 0);
          assert.equal(callbackError, 1);
          assert.equal(callbackStatusCode404, 1);
          assert.equal(callbackStatusCode200, 0);
          assert.equal(callbackComplete, 1);

          if (!isJquery) {
            assert.instanceOf(xhr, XMLHttpRequest);
          }
          assert.equal(textStatus, 'error');
        },
      })
        .then(function () {
          reject('not found');
        })
        .catch(function () {
          resolve();
        });
    });
  });

  it('beforeSend 回调中返回 false 来取消 Ajax 请求', function () {
    return new Promise<void>((resolve, reject) => {
      $.ajax({
        method: 'get',
        url: './data/test.php',
        beforeSend: function () {
          return false;
        },
      })
        .then(function () {
          reject('cancel');
        })
        .catch(function () {
          resolve();
        });
    });
  });

  it('GET 请求，请求超时', function () {
    return new Promise<void>((resolve, reject) => {
      $.ajax({
        method: 'get',
        url: `${phpPath}/timeout.php`,
        timeout: 1000,
        error: function () {
          resolve();
        },
        success: function () {
          reject('timeout');
        },
      });
    });
  });

  it('所有请求，提交参数', function () {
    // 提交查询字符串参数
    return $.ajax({
      method: 'get',
      url: `${phpPath}/params.php`,
      data: 'key1=val1&key2=val2',
      success: function (data, textStatus, xhr) {
        assert.equal(data, 'get');
        assert.equal(textStatus, 'success');
        if (!isJquery) {
          assert.instanceOf(xhr, XMLHttpRequest);
        }
      },
      error: function () {
        assert.isTrue(false);
      },
    })
      .then(function (data) {
        assert.equal(data, 'get');
      })
      .then(() => {
        // 提交对象参数
        return $.ajax({
          method: 'get',
          url: `${phpPath}/params.php`,
          data: {
            key1: 'val1',
            key2: 'val2',
          },
          success: function (data, textStatus, xhr) {
            assert.equal(data, 'get');
            assert.equal(textStatus, 'success');
            if (!isJquery) {
              assert.instanceOf(xhr, XMLHttpRequest);
            }
          },
          error: function () {
            assert.isTrue(false);
          },
        });
      })
      .then(function (data) {
        assert.equal(data, 'get');
      })
      .then(() => {
        return $.ajax({
          method: 'post',
          url: `${phpPath}/params.php`,
          data: {
            key1: 'val1',
            key2: 'val2',
          },
          success: function (data, textStatus, xhr) {
            assert.equal(data, 'post');
            assert.equal(textStatus, 'success');
            if (!isJquery) {
              assert.instanceOf(xhr, XMLHttpRequest);
            }
          },
          error: function () {
            assert.isTrue(false);
          },
        });
      })
      .then(function (data) {
        assert.equal(data, 'post');
      })
      .then(() => {
        return $.ajax({
          method: 'put',
          url: `${phpPath}/params.php`,
          data: {
            key1: 'val1',
            key2: 'val2',
          },
          success: function (data, textStatus, xhr) {
            assert.equal(data, 'put');
            assert.equal(textStatus, 'success');
            if (!isJquery) {
              assert.instanceOf(xhr, XMLHttpRequest);
            }
          },
          error: function () {
            assert.isTrue(false);
          },
        });
      })
      .then(function (data) {
        assert.equal(data, 'put');
      })
      .then(() => {
        return $.ajax({
          method: 'delete',
          url: `${phpPath}/params.php`,
          data: {
            key1: 'val1',
            key2: 'val2',
          },
          success: function (data, textStatus, xhr) {
            assert.equal(data, 'delete');
            assert.equal(textStatus, 'success');
            if (!isJquery) {
              assert.instanceOf(xhr, XMLHttpRequest);
            }
          },
          error: function () {
            assert.isTrue(false);
          },
        });
      })
      .then(function (data) {
        assert.equal(data, 'delete');
      })
      .then(() => {
        return $.ajax({
          method: 'head',
          url: `${phpPath}/params.php`,
          data: {
            key1: 'val1',
            key2: 'val2',
          },
          success: function (data, textStatus, xhr) {
            assert.isUndefined(data);
            assert.equal(textStatus, 'nocontent');
            if (!isJquery) {
              assert.instanceOf(xhr, XMLHttpRequest);
            }
          },
          error: function () {
            assert.isTrue(false);
          },
        });
      })
      .then(function (data) {
        assert.isUndefined(data);
      })
      .then(() => {
        return $.ajax({
          method: 'options',
          url: `${phpPath}/params.php`,
          data: {
            key1: 'val1',
            key2: 'val2',
          },
          success: function (data, textStatus, xhr) {
            assert.equal(data, 'options');
            assert.equal(textStatus, 'success');
            if (!isJquery) {
              assert.instanceOf(xhr, XMLHttpRequest);
            }
          },
          error: function () {
            assert.isTrue(false);
          },
        });
      })
      .then(function (data) {
        assert.equal(data, 'options');
      })
      .then(() => {
        return $.ajax({
          method: 'patch',
          url: `${phpPath}/params.php`,
          data: {
            key1: 'val1',
            key2: 'val2',
          },
          success: function (data, textStatus, xhr) {
            assert.equal(data, 'patch');
            assert.equal(textStatus, 'success');
            if (!isJquery) {
              assert.instanceOf(xhr, XMLHttpRequest);
            }
          },
          error: function () {
            assert.isTrue(false);
          },
        });
      })
      .then(function (data) {
        assert.equal(data, 'patch');
      });
  });

  it('获取 JSON 数据', function () {
    // 没有指定 dataType
    return $.ajax({
      method: 'get',
      url: `${phpPath}/json.php`,
      success: function (data) {
        assert.isString(data);
      },
    })
      .then(function (data) {
        assert.isString(data);
      })
      .then(() => {
        // 成功获取 json 数据
        return $.ajax({
          method: 'get',
          url: `${phpPath}/json.php`,
          dataType: 'json',
          success: function (data) {
            assert.isObject(data);
            assert.equal(data.key1, 'val1');
            assert.equal(data.key2, 'val2');
          },
        });
      })
      .then(function (data) {
        assert.isObject(data);
        assert.equal(data.key1, 'val1');
        assert.equal(data.key2, 'val2');
      })
      .then(() => {
        // json 数据格式错误
        return $.ajax({
          method: 'get',
          url: `${phpPath}/json_error.php`,
          dataType: 'json',
          error: function (_, textStatus) {
            assert.equal(textStatus, 'parsererror');
          },
        });
      })
      .catch(function () {
        assert.isTrue(true);
      });
  });

  it('禁用 GET/HEAD 请求的缓存', function () {
    return $.ajax({
      method: 'get',
      url: `${phpPath}/json.php`,
      cache: false,
      success: function (_, __, xhr) {
        if (!isJquery && !(window.ActiveXObject || 'ActiveXObject' in window)) {
          assert.isTrue(xhr.responseURL.indexOf('_=') > 0);
        }
      },
    })
      .then(() => {
        return $.ajax({
          method: 'head',
          url: `${phpPath}/json.php`,
          cache: false,
          success: function (_, __, xhr) {
            if (
              !isJquery &&
              !(window.ActiveXObject || 'ActiveXObject' in window)
            ) {
              assert.isTrue(xhr.responseURL.indexOf('_=') > 0);
            }
          },
        });
      })
      .then(() => {
        return $.ajax({
          method: 'post',
          url: `${phpPath}/json.php`,
          cache: false,
          success: function (_, __, xhr) {
            if (
              !isJquery &&
              !(window.ActiveXObject || 'ActiveXObject' in window)
            ) {
              assert.isFalse(xhr.responseURL.indexOf('_=') > 0);
            }
          },
        });
      });
  });

  it('processData: false 不把数据转换为查询字符串', function () {
    return $.ajax({
      method: 'post',
      data: {
        key1: 'val1',
        key2: 'val2',
      },
      url: `${phpPath}/processData.php`,
      processData: false,
      success: function (data) {
        assert.equal(data, 'success');
      },
    }).then(function (data) {
      assert.equal(data, 'success');
    });
  });
});
