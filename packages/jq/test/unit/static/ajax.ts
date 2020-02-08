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

describe('$.ajax', function() {
  it('ajax 测试环境', function() {
    chai.assert.isTrue(hasPHP, '必须安装 PHP 环境才能测试 Ajax');
    chai.assert.isTrue(!isLocal, '必须通过服务器环境访问才能测试 Ajax');
  });

  it('GET 请求，请求成功，返回 text，测试回调函数参数、全局事件、事件触发顺序', function() {
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
    $(document).on('start.mdui.ajax', function(event, params) {
      chai.assert.instanceOf(params.xhr, XMLHttpRequest);
      // @ts-ignore
      chai.assert.instanceOf(event._detail.xhr, XMLHttpRequest);

      chai.assert.isObject(params.options);
      chai.assert.equal(params.options.method, 'GET');

      chai.assert.equal(params.data, null);

      eventStart++;
      chai.assert.equal(eventStart, 1);
      chai.assert.equal(eventSuccess, 0);
      chai.assert.equal(eventError, 0);
      chai.assert.equal(eventComplete, 0);
    });

    $(document).on('success.mdui.ajax', function(event, params) {
      chai.assert.instanceOf(params.xhr, XMLHttpRequest);
      // @ts-ignore
      chai.assert.instanceOf(event._detail.xhr, XMLHttpRequest);

      chai.assert.isObject(params.options);
      chai.assert.equal(params.options.method, 'GET');

      chai.assert.equal(params.data, 'is a text');

      eventSuccess++;
      chai.assert.equal(eventStart, 1);
      chai.assert.equal(eventSuccess, 1);
      chai.assert.equal(eventError, 0);
      chai.assert.equal(eventComplete, 0);
    });

    $(document).on('error.mdui.ajax', function(event, params) {
      chai.assert.instanceOf(params.xhr, XMLHttpRequest);
      // @ts-ignore
      chai.assert.instanceOf(event._detail.xhr, XMLHttpRequest);

      chai.assert.isObject(params.options);
      chai.assert.equal(params.options.method, 'GET');

      chai.assert.equal(params.data, null);

      eventError++;
    });

    $(document).on('complete.mdui.ajax', function(event, params) {
      chai.assert.instanceOf(params.xhr, XMLHttpRequest);
      // @ts-ignore
      chai.assert.instanceOf(event._detail.xhr, XMLHttpRequest);

      chai.assert.isObject(params.options);
      chai.assert.equal(params.options.method, 'GET');

      chai.assert.equal(params.data, 'is a text');

      eventComplete++;
      chai.assert.equal(eventStart, 1);
      chai.assert.equal(eventSuccess, 1);
      chai.assert.equal(eventError, 0);
      chai.assert.equal(eventComplete, 1);
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
    document.addEventListener('start.mdui.ajax', function(event) {
      // @ts-ignore
      chai.assert.instanceOf(event._detail.xhr, XMLHttpRequest);
    });

    document.addEventListener('success.mdui.ajax', function(event) {
      // @ts-ignore
      chai.assert.instanceOf(event._detail.xhr, XMLHttpRequest);
    });

    document.addEventListener('error.mdui.ajax', function(event) {
      // @ts-ignore
      chai.assert.instanceOf(event._detail.xhr, XMLHttpRequest);
    });

    document.addEventListener('complete.mdui.ajax', function(event) {
      // @ts-ignore
      chai.assert.instanceOf(event._detail.xhr, XMLHttpRequest);
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
    $(document).ajaxStart(function(_, xhr, options) {
      if (!isJquery) {
        chai.assert.instanceOf(xhr, XMLHttpRequest);
        chai.assert.isObject(options);
      }
    });

    $(document).ajaxSuccess(function(_, xhr, options, data) {
      if (!isJquery) {
        chai.assert.instanceOf(xhr, XMLHttpRequest);
      }
      chai.assert.isObject(options);
      chai.assert.equal(data, 'is a text');
    });

    $(document).ajaxError(function(_, xhr, options) {
      if (!isJquery) {
        chai.assert.instanceOf(xhr, XMLHttpRequest);
      }
      chai.assert.isObject(options);
    });

    $(document).ajaxComplete(function(_, xhr, options) {
      if (!isJquery) {
        chai.assert.instanceOf(xhr, XMLHttpRequest);
      }
      chai.assert.isObject(options);
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
      url: './data/get_text.html',
      global: true,
      beforeSend: function(xhr) {
        callbackBeforeSend++;
        chai.assert.equal(callbackBeforeSend, 1);
        chai.assert.equal(callbackSuccess, 0);
        chai.assert.equal(callbackError, 0);
        chai.assert.equal(callbackStatusCode404, 0);
        chai.assert.equal(callbackStatusCode200, 0);
        chai.assert.equal(callbackComplete, 0);

        if (!isJquery) {
          chai.assert.instanceOf(xhr, XMLHttpRequest);
        }
      },
      success: function(data, textStatus, xhr) {
        callbackSuccess++;
        chai.assert.equal(callbackBeforeSend, 1);
        chai.assert.equal(callbackSuccess, 1);
        chai.assert.equal(callbackError, 0);
        chai.assert.equal(callbackStatusCode404, 0);
        chai.assert.equal(callbackStatusCode200, 0);
        chai.assert.equal(callbackComplete, 0);

        chai.assert.equal(data, 'is a text');
        chai.assert.equal(textStatus, 'success');
        if (!isJquery) {
          chai.assert.instanceOf(xhr, XMLHttpRequest);
        }
      },
      error: function() {
        callbackError++;
      },
      statusCode: {
        404: function(): void {
          callbackStatusCode404++;
        },
        200: function(data, textStatus, xhr): void {
          callbackStatusCode200++;
          chai.assert.equal(callbackBeforeSend, 1);
          chai.assert.equal(callbackSuccess, 1);
          chai.assert.equal(callbackError, 0);
          chai.assert.equal(callbackStatusCode404, 0);
          chai.assert.equal(callbackStatusCode200, 1);
          chai.assert.equal(callbackComplete, 0);

          chai.assert.equal(data, 'is a text');
          chai.assert.equal(textStatus, 'success');

          if (!isJquery) {
            chai.assert.instanceOf(xhr, XMLHttpRequest);
          }
        },
      },
      complete: function(xhr, textStatus) {
        callbackComplete++;
        chai.assert.equal(callbackBeforeSend, 1);
        chai.assert.equal(callbackSuccess, 1);
        chai.assert.equal(callbackError, 0);
        chai.assert.equal(callbackStatusCode404, 0);
        chai.assert.equal(callbackStatusCode200, 1);
        chai.assert.equal(callbackComplete, 1);

        if (!isJquery) {
          chai.assert.instanceOf(xhr, XMLHttpRequest);
        }
        chai.assert.equal(textStatus, 'success');
      },
    }).then(function(data) {
      chai.assert.equal(data, 'is a text');
    });
    if (!isJquery) {
      chai.assert.instanceOf(promise, Promise);
    }

    return promise;
  });

  it('GET 请求，请求返回 404，测试回调函数参数，全局事件', function() {
    // 用于测试事件触发顺序
    let eventStart = 0;
    let eventSuccess = 0;
    let eventError = 0;
    let eventComplete = 0;

    // ==============================================
    // 事件监听，这 4 个事件仅支持 mdui.jq，不支持 jQuery
    // ==============================================
    $(document).on('start.mdui.ajax', function() {
      eventStart++;
      chai.assert.equal(eventStart, 1);
      chai.assert.equal(eventSuccess, 0);
      chai.assert.equal(eventError, 0);
      chai.assert.equal(eventComplete, 0);
    });

    $(document).on('success.mdui.ajax', function() {
      eventSuccess++;
    });

    $(document).on('error.mdui.ajax', function() {
      eventError++;
      chai.assert.equal(eventStart, 1);
      chai.assert.equal(eventSuccess, 0);
      chai.assert.equal(eventError, 1);
      chai.assert.equal(eventComplete, 0);
    });

    $(document).on('complete.mdui.ajax', function() {
      eventComplete++;
      chai.assert.equal(eventStart, 1);
      chai.assert.equal(eventSuccess, 0);
      chai.assert.equal(eventError, 1);
      chai.assert.equal(eventComplete, 1);
    });

    // 用于测试回调函数触发顺序
    let callbackBeforeSend = 0;
    let callbackSuccess = 0;
    let callbackError = 0;
    let callbackComplete = 0;
    let callbackStatusCode404 = 0;
    let callbackStatusCode200 = 0;

    return new Promise((resolve, reject) => {
      $.ajax({
        method: 'get',
        url: './data/not_fount.html',
        global: true,
        beforeSend: function() {
          callbackBeforeSend++;
          chai.assert.equal(callbackBeforeSend, 1);
          chai.assert.equal(callbackSuccess, 0);
          chai.assert.equal(callbackError, 0);
          chai.assert.equal(callbackStatusCode404, 0);
          chai.assert.equal(callbackStatusCode200, 0);
          chai.assert.equal(callbackComplete, 0);
        },
        success: function() {
          callbackSuccess++;
          reject('error');
        },
        error: function(xhr, textStatus) {
          callbackError++;
          chai.assert.equal(callbackBeforeSend, 1);
          chai.assert.equal(callbackSuccess, 0);
          chai.assert.equal(callbackError, 1);
          chai.assert.equal(callbackStatusCode404, 0);
          chai.assert.equal(callbackStatusCode200, 0);
          chai.assert.equal(callbackComplete, 0);

          if (!isJquery) {
            chai.assert.instanceOf(xhr, XMLHttpRequest);
          }
          chai.assert.equal(textStatus, 'error');
        },
        statusCode: {
          404: function(xhr): void {
            callbackStatusCode404++;
            chai.assert.equal(callbackBeforeSend, 1);
            chai.assert.equal(callbackSuccess, 0);
            chai.assert.equal(callbackError, 1);
            chai.assert.equal(callbackStatusCode404, 1);
            chai.assert.equal(callbackStatusCode200, 0);
            chai.assert.equal(callbackComplete, 0);

            if (!isJquery && xhr !== null) {
              chai.assert.instanceOf(xhr, XMLHttpRequest);
            }
          },
          200: function(): void {
            callbackStatusCode200++;
          },
        },
        complete: function(xhr, textStatus) {
          callbackComplete++;
          chai.assert.equal(callbackBeforeSend, 1);
          chai.assert.equal(callbackSuccess, 0);
          chai.assert.equal(callbackError, 1);
          chai.assert.equal(callbackStatusCode404, 1);
          chai.assert.equal(callbackStatusCode200, 0);
          chai.assert.equal(callbackComplete, 1);

          if (!isJquery) {
            chai.assert.instanceOf(xhr, XMLHttpRequest);
          }
          chai.assert.equal(textStatus, 'error');
        },
      }).catch(function() {
        resolve();
      });
    });
  });

  it('beforeSend 回调中返回 false 来取消 Ajax 请求', function() {
    return new Promise((resolve, reject) => {
      $.ajax({
        method: 'get',
        url: './data/test.php',
        beforeSend: function() {
          return false;
        },
      })
        .then(function() {
          reject('cancel');
        })
        .catch(function() {
          resolve();
        });
    });
  });

  it('GET 请求，请求超时', function() {
    return new Promise((resolve, reject) => {
      $.ajax({
        method: 'get',
        url: `${phpPath}/timeout.php`,
        timeout: 1000,
        error: function() {
          resolve();
        },
        success: function() {
          reject('timeout');
        },
      });
    });
  });

  it('所有请求，提交参数', function() {
    // 提交查询字符串参数
    return $.ajax({
      method: 'get',
      url: `${phpPath}/params.php`,
      data: 'key1=val1&key2=val2',
      success: function(data, textStatus, xhr) {
        chai.assert.equal(data, 'get');
        chai.assert.equal(textStatus, 'success');
        if (!isJquery) {
          chai.assert.isTrue(
            xhr.responseURL.indexOf('/data/params.php?key1=val1&key2=val2') > 0,
          );
        }
      },
      error: function() {
        chai.assert.isTrue(false);
      },
    })
      .then(function(data) {
        chai.assert.equal(data, 'get');
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
          success: function(data, textStatus, xhr) {
            chai.assert.equal(data, 'get');
            chai.assert.equal(textStatus, 'success');
            if (!isJquery) {
              chai.assert.isTrue(
                xhr.responseURL.indexOf(
                  '/data/params.php?key1=val1&key2=val2',
                ) > 0,
              );
            }
          },
          error: function() {
            chai.assert.isTrue(false);
          },
        });
      })
      .then(function(data) {
        chai.assert.equal(data, 'get');
      })
      .then(() => {
        return $.ajax({
          method: 'post',
          url: `${phpPath}/params.php`,
          data: {
            key1: 'val1',
            key2: 'val2',
          },
          success: function(data, textStatus, xhr) {
            chai.assert.equal(data, 'post');
            chai.assert.equal(textStatus, 'success');
            if (!isJquery) {
              chai.assert.isTrue(
                xhr.responseURL.indexOf('/data/params.php') > 0,
              );
            }
          },
          error: function() {
            chai.assert.isTrue(false);
          },
        });
      })
      .then(function(data) {
        chai.assert.equal(data, 'post');
      })
      .then(() => {
        return $.ajax({
          method: 'put',
          url: `${phpPath}/params.php`,
          data: {
            key1: 'val1',
            key2: 'val2',
          },
          success: function(data, textStatus, xhr) {
            chai.assert.equal(data, 'put');
            chai.assert.equal(textStatus, 'success');
            if (!isJquery) {
              chai.assert.isTrue(
                xhr.responseURL.indexOf('/data/params.php') > 0,
              );
            }
          },
          error: function() {
            chai.assert.isTrue(false);
          },
        });
      })
      .then(function(data) {
        chai.assert.equal(data, 'put');
      })
      .then(() => {
        return $.ajax({
          method: 'delete',
          url: `${phpPath}/params.php`,
          data: {
            key1: 'val1',
            key2: 'val2',
          },
          success: function(data, textStatus, xhr) {
            chai.assert.equal(data, 'delete');
            chai.assert.equal(textStatus, 'success');
            if (!isJquery) {
              chai.assert.isTrue(
                xhr.responseURL.indexOf('/data/params.php') > 0,
              );
            }
          },
          error: function() {
            chai.assert.isTrue(false);
          },
        });
      })
      .then(function(data) {
        chai.assert.equal(data, 'delete');
      })
      .then(() => {
        return $.ajax({
          method: 'head',
          url: `${phpPath}/params.php`,
          data: {
            key1: 'val1',
            key2: 'val2',
          },
          success: function(data, textStatus, xhr) {
            chai.assert.isUndefined(data);
            chai.assert.equal(textStatus, 'nocontent');
            if (!isJquery) {
              chai.assert.isTrue(
                xhr.responseURL.indexOf(
                  '/data/params.php?key1=val1&key2=val2',
                ) > 0,
              );
            }
          },
          error: function() {
            chai.assert.isTrue(false);
          },
        });
      })
      .then(function(data) {
        chai.assert.isUndefined(data);
      })
      .then(() => {
        return $.ajax({
          method: 'options',
          url: `${phpPath}/params.php`,
          data: {
            key1: 'val1',
            key2: 'val2',
          },
          success: function(data, textStatus, xhr) {
            chai.assert.equal(data, 'options');
            chai.assert.equal(textStatus, 'success');
            if (!isJquery) {
              chai.assert.isTrue(
                xhr.responseURL.indexOf('/data/params.php') > 0,
              );
            }
          },
          error: function() {
            chai.assert.isTrue(false);
          },
        });
      })
      .then(function(data) {
        chai.assert.equal(data, 'options');
      })
      .then(() => {
        return $.ajax({
          method: 'patch',
          url: `${phpPath}/params.php`,
          data: {
            key1: 'val1',
            key2: 'val2',
          },
          success: function(data, textStatus, xhr) {
            chai.assert.equal(data, 'patch');
            chai.assert.equal(textStatus, 'success');
            if (!isJquery) {
              chai.assert.isTrue(
                xhr.responseURL.indexOf('/data/params.php') > 0,
              );
            }
          },
          error: function() {
            chai.assert.isTrue(false);
          },
        });
      })
      .then(function(data) {
        chai.assert.equal(data, 'patch');
      });
  });

  it('获取 JSON 数据', function() {
    // 没有指定 dataType
    return $.ajax({
      method: 'get',
      url: `${phpPath}/json.php`,
      success: function(data) {
        chai.assert.isString(data);
      },
    })
      .then(function(data) {
        chai.assert.isString(data);
      })
      .then(() => {
        // 成功获取 json 数据
        return $.ajax({
          method: 'get',
          url: `${phpPath}/json.php`,
          dataType: 'json',
          success: function(data) {
            chai.assert.isObject(data);
            chai.assert.equal(data.key1, 'val1');
            chai.assert.equal(data.key2, 'val2');
          },
        });
      })
      .then(function(data) {
        chai.assert.isObject(data);
        chai.assert.equal(data.key1, 'val1');
        chai.assert.equal(data.key2, 'val2');
      })
      .then(() => {
        // json 数据格式错误
        return $.ajax({
          method: 'get',
          url: `${phpPath}/json_error.php`,
          dataType: 'json',
          error: function(_, textStatus) {
            chai.assert.equal(textStatus, 'parsererror');
          },
        });
      })
      .catch(function() {
        chai.assert.isTrue(true);
      });
  });

  it('禁用 GET/HEAD 请求的缓存', function() {
    return $.ajax({
      method: 'get',
      url: `${phpPath}/json.php`,
      cache: false,
      success: function(_, __, xhr) {
        if (!isJquery) {
          chai.assert.isTrue(xhr.responseURL.indexOf('_=') > 0);
        }
      },
    })
      .then(() => {
        return $.ajax({
          method: 'head',
          url: `${phpPath}/json.php`,
          cache: false,
          success: function(_, __, xhr) {
            if (!isJquery) {
              chai.assert.isTrue(xhr.responseURL.indexOf('_=') > 0);
            }
          },
        });
      })
      .then(() => {
        return $.ajax({
          method: 'post',
          url: `${phpPath}/json.php`,
          cache: false,
          success: function(_, __, xhr) {
            if (!isJquery) {
              chai.assert.isFalse(xhr.responseURL.indexOf('_=') > 0);
            }
          },
        });
      });
  });

  it('processData: false 不把数据转换为查询字符串', function() {
    return $.ajax({
      method: 'post',
      data: {
        key1: 'val1',
        key2: 'val2',
      },
      url: `${phpPath}/processData.php`,
      processData: false,
      success: function(data) {
        chai.assert.equal(data, 'success');
      },
    }).then(function(data) {
      chai.assert.equal(data, 'success');
    });
  });
});
