var hasPHP = true;
var isLocal = window.location.protocol === 'file:';

$.ajaxSetup({
  // 禁止触发全局事件，避免影响全局事件的测试
  global: false
});

/**
 * 回调函数顺序为 beforeSend -> success|error -> statusCode -> complete
 */

describe('Ajax', function () {
  it('ajax 测试环境', function () {
    assert.isTrue(hasPHP, '必须安装 PHP 环境才能测试 Ajax');
    assert.isTrue(!isLocal, '必须通过服务器环境访问才能测试 Ajax');
  });

  it('GET 请求，请求成功，返回 text，测试回调函数参数、全局事件、事件触发顺序', function () {
    // 用于测试事件触发顺序
    var eventStart = 0;
    var eventSuccess = 0;
    var eventError = 0;
    var eventComplete = 0;

    // ==============================================
    // 事件监听，这 4 个事件仅支持 mdui.JQ，不支持 jQuery
    // ==============================================
    // event: 事件对象
    // params: {
    //   xhr: XMLHttpRequest 对象
    //   options: AJAX 请求的配置参数
    //   data: AJAX 请求返回的数据
    // }
    $(document).on('start.mdui.ajax', function (event, params) {
      assert.equal(params.xhr.constructor, XMLHttpRequest);
      assert.equal(event.detail.xhr.constructor, XMLHttpRequest);

      assert.equal(typeof params.options, 'object');
      assert.equal(params.options.method, 'GET');

      assert.equal(params.data, null);

      eventStart++;
      assert.equal(eventStart, 1);
      assert.equal(eventSuccess, 0);
      assert.equal(eventError, 0);
      assert.equal(eventComplete, 0);
    });

    $(document).on('success.mdui.ajax', function (event, params) {
      assert.equal(params.xhr.constructor, XMLHttpRequest);
      assert.equal(event.detail.xhr.constructor, XMLHttpRequest);

      assert.equal(typeof params.options, 'object');
      assert.equal(params.options.method, 'GET');

      assert.equal(params.data, 'is a text');

      eventSuccess++;
      assert.equal(eventStart, 1);
      assert.equal(eventSuccess, 1);
      assert.equal(eventError, 0);
      assert.equal(eventComplete, 0);
    });

    $(document).on('error.mdui.ajax', function (event, params) {
      assert.equal(params.xhr.constructor, XMLHttpRequest);
      assert.equal(event.detail.xhr.constructor, XMLHttpRequest);

      assert.equal(typeof params.options, 'object');
      assert.equal(params.options.method, 'GET');

      assert.equal(params.data, null);

      eventError++;
    });

    $(document).on('complete.mdui.ajax', function (event, params) {
      assert.equal(params.xhr.constructor, XMLHttpRequest);
      assert.equal(event.detail.xhr.constructor, XMLHttpRequest);

      assert.equal(typeof params.options, 'object');
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
      assert.equal(event.detail.xhr.constructor, XMLHttpRequest);
    });

    document.addEventListener('success.mdui.ajax', function (event) {
      assert.equal(event.detail.xhr.constructor, XMLHttpRequest);
    });

    document.addEventListener('error.mdui.ajax', function (event) {
      assert.equal(event.detail.xhr.constructor, XMLHttpRequest);
    });

    document.addEventListener('complete.mdui.ajax', function (event) {
      assert.equal(event.detail.xhr.constructor, XMLHttpRequest);
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
    $(document).ajaxStart(function (event, xhr, options) {
      if (!isJquery) {
        assert.equal(xhr.constructor, XMLHttpRequest);
        assert.equal(typeof options, 'object');
      }
    });

    $(document).ajaxSuccess(function (event, xhr, options, data) {
      if (!isJquery) {
        assert.equal(xhr.constructor, XMLHttpRequest);
      }
      assert.equal(typeof options, 'object');
      assert.equal(data, 'is a text')
    });

    $(document).ajaxError(function (event, xhr, options) {
      if (!isJquery) {
        assert.equal(xhr.constructor, XMLHttpRequest);
      }
      assert.equal(typeof options, 'object');
    });

    $(document).ajaxComplete(function (event, xhr, options) {
      if (!isJquery) {
        assert.equal(xhr.constructor, XMLHttpRequest);
      }
      assert.equal(typeof options, 'object');
    });

    // 用于测试回调函数触发顺序
    var callbackBeforeSend = 0;
    var callbackSuccess = 0;
    var callbackError = 0;
    var callbackComplete = 0;
    var callbackStatusCode404 = 0;
    var callbackStatusCode200 = 0;

    var xhr = $.ajax({
      method: 'GET',
      url: './data/get_text.html',
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
          assert.equal(xhr.constructor, XMLHttpRequest);
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
          assert.equal(xhr.constructor, XMLHttpRequest);
        }
      },
      error: function (xhr, textStatus) {
        callbackError++;
      },
      statusCode: {
        404: function (xhr, textStatus) {
          callbackStatusCode404++;
        },
        200: function (data, textStatus, xhr) {
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
            assert.equal(xhr.constructor, XMLHttpRequest);
          }
        }
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
          assert.equal(xhr.constructor, XMLHttpRequest);
        }
        assert.equal(textStatus, 'success');

        $(document).off('start.mdui.ajax');
        $(document).off('success.mdui.ajax');
        $(document).off('error.mdui.ajax');
        $(document).off('complete.mdui.ajax');
      }
    });
    if (!isJquery) {
      assert.equal(xhr.constructor, XMLHttpRequest);
    }
  });

  it('GET 请求，请求返回 404，测试回调函数参数，全局事件', function () {
    setTimeout(function () {
      // 用于测试事件触发顺序
      var eventStart = 0;
      var eventSuccess = 0;
      var eventError = 0;
      var eventComplete = 0;

      // ==============================================
      // 事件监听，这 4 个事件仅支持 mdui.JQ，不支持 jQuery
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
      var callbackBeforeSend = 0;
      var callbackSuccess = 0;
      var callbackError = 0;
      var callbackComplete = 0;
      var callbackStatusCode404 = 0;
      var callbackStatusCode200 = 0;

      $.ajax({
        method: 'get',
        url: './data/not_fount.html',
        global: true,
        beforeSend: function (xhr) {
          callbackBeforeSend++;
          assert.equal(callbackBeforeSend, 1);
          assert.equal(callbackSuccess, 0);
          assert.equal(callbackError, 0);
          assert.equal(callbackStatusCode404, 0);
          assert.equal(callbackStatusCode200, 0);
          assert.equal(callbackComplete, 0);
        },
        success: function (data, textStatus, xhr) {
          callbackSuccess++;
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
            assert.equal(xhr.constructor, XMLHttpRequest);
          }
          assert.equal(textStatus, 'error');
        },
        statusCode: {
          404: function (xhr) {
            callbackStatusCode404++;
            assert.equal(callbackBeforeSend, 1);
            assert.equal(callbackSuccess, 0);
            assert.equal(callbackError, 1);
            assert.equal(callbackStatusCode404, 1);
            assert.equal(callbackStatusCode200, 0);
            assert.equal(callbackComplete, 0);

            if (!isJquery && xhr !== null) {
              assert.equal(xhr.constructor, XMLHttpRequest);
            }
          },
          200: function (xhr) {
            callbackStatusCode200++;
          }
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
            assert.equal(xhr.constructor, XMLHttpRequest);
          }
          assert.equal(textStatus, 'error');

          $(document).off('start.mdui.ajax');
          $(document).off('success.mdui.ajax');
          $(document).off('error.mdui.ajax');
          $(document).off('complete.mdui.ajax');
        }
      });
    }, 1000);
  });

  it('beforeSend 回调中返回 false 来取消 Ajax 请求', function () {
    setTimeout(function () {
      $.ajax({
        method: 'get',
        url: './data/test.php',
        beforeSend: function () {
          return false;
        }
      });
    }, 2000);
  });

  it('GET 请求，请求超时', function () {
    $.ajax({
      method: 'get',
      url: './data/timeout.php',
      timeout: 1000,
      error: function (xhr, textStatus) {
        assert.equal(textStatus, 'timeout');
      }
    })
  });

  it('所有请求，提交参数', function () {
    // 提交查询字符串参数
    $.ajax({
      method: 'get',
      url: './data/params.php',
      data: 'key1=val1&key2=val2',
      success: function (data, textStatus, xhr) {
        assert.equal(data, 'get');
        assert.equal(textStatus, 'success');
        if (!isJquery) {
          assert.isTrue(xhr.responseURL.indexOf('/data/params.php?key1=val1&key2=val2') > 0);
        }
      }
    });

    // 提交对象参数
    $.ajax({
      method: 'get',
      url: './data/params.php',
      data: {
        key1: 'val1',
        key2: 'val2'
      },
      success: function (data, textStatus, xhr) {
        assert.equal(data, 'get');
        assert.equal(textStatus, 'success');
        if (!isJquery) {
          assert.isTrue(xhr.responseURL.indexOf('/data/params.php?key1=val1&key2=val2') > 0);
        }
      }
    });

    $.ajax({
      method: 'post',
      url: './data/params.php',
      data: {
        key1: 'val1',
        key2: 'val2'
      },
      success: function (data, textStatus, xhr) {
        assert.equal(data, 'post');
        assert.equal(textStatus, 'success');
        if (!isJquery) {
          assert.isTrue(xhr.responseURL.indexOf('/data/params.php') > 0);
        }
      }
    });

    $.ajax({
      method: 'put',
      url: './data/params.php',
      data: {
        key1: 'val1',
        key2: 'val2'
      },
      success: function (data, textStatus, xhr) {
        assert.equal(data, 'put');
        assert.equal(textStatus, 'success');
        if (!isJquery) {
          assert.isTrue(xhr.responseURL.indexOf('/data/params.php') > 0);
        }
      }
    });

    $.ajax({
      method: 'delete',
      url: './data/params.php',
      data: {
        key1: 'val1',
        key2: 'val2'
      },
      success: function (data, textStatus, xhr) {
        assert.equal(data, 'delete');
        assert.equal(textStatus, 'success');
        if (!isJquery) {
          assert.isTrue(xhr.responseURL.indexOf('/data/params.php') > 0);
        }
      }
    });

    $.ajax({
      method: 'head',
      url: './data/params.php',
      data: {
        key1: 'val1',
        key2: 'val2'
      },
      success: function (data, textStatus, xhr) {
        assert.equal(textStatus, 'nocontent');
        if (!isJquery) {
          assert.isTrue(xhr.responseURL.indexOf('/data/params.php?key1=val1&key2=val2') > 0);
        }
      }
    });

    $.ajax({
      method: 'options',
      url: './data/params.php',
      data: {
        key1: 'val1',
        key2: 'val2'
      },
      success: function (data, textStatus, xhr) {
        assert.equal(data, 'options');
        assert.equal(textStatus, 'success');
        if (!isJquery) {
          assert.isTrue(xhr.responseURL.indexOf('/data/params.php') > 0);
        }
      }
    });

    $.ajax({
      method: 'patch',
      url: './data/params.php',
      data: {
        key1: 'val1',
        key2: 'val2'
      },
      success: function (data, textStatus, xhr) {
        assert.equal(data, 'patch');
        assert.equal(textStatus, 'success');
        if (!isJquery) {
          assert.isTrue(xhr.responseURL.indexOf('/data/params.php') > 0);
        }
      }
    });
  });

  it('获取 JSON 数据', function () {
    // 没有指定 dataType
    $.ajax({
      method: 'get',
      url: './data/json.php',
      success: function (data) {
        assert.equal(typeof data, 'string');
      }
    });

    // 成功获取 json 数据
    $.ajax({
      method: 'get',
      url: './data/json.php',
      dataType: 'json',
      success: function (data) {
        assert.equal(typeof data, 'object');
        assert.equal(data.key1, 'val1');
        assert.equal(data.key2, 'val2');
      }
    });

    // json 数据格式错误
    $.ajax({
      method: 'get',
      url: './data/json_error.php',
      dataType: 'json',
      error: function (xhr, textStatus) {
        assert.equal(textStatus, 'parsererror');
      }
    })
  });

  it('禁用 GET/HEAD 请求的缓存', function () {
    $.ajax({
      method: 'get',
      url: './data/json.php',
      cache: false,
      success: function (data, textStatus, xhr) {
        if (!isJquery) {
          assert.isTrue(xhr.responseURL.indexOf('_=') > 0);
        }
      }
    });

    $.ajax({
      method: 'head',
      url: './data/json.php',
      cache: false,
      success: function (data, textStatus, xhr) {
        if (!isJquery) {
          assert.isTrue(xhr.responseURL.indexOf('_=') > 0);
        }
      }
    });

    $.ajax({
      method: 'post',
      url: './data/json.php',
      cache: false,
      success: function (data, textStatus, xhr) {
        if (!isJquery) {
          assert.isFalse(xhr.responseURL.indexOf('_=') > 0);
        }
      }
    });
  });

  it('测试 JSONP，只支持 GET 请求', function () {
    $.ajax({
      method: 'get',
      dataType: 'jsonp',
      url: './data/jsonp.php?key=val&callback2=test&a=b',
      jsonp: 'callback2',
      beforeSend: function (xhr) {
        if (!isJquery) {
          assert.equal(xhr, null);
        }
      },
      success: function (data, textStatus, xhr) {
        assert.equal(data.key1, 'val1');
        assert.equal(data.key2, 'val2');
        assert.equal(textStatus, 'success');

        if (!isJquery) {
          assert.equal(xhr, null);
        }
      }
    });

    // 自定义 jsonpCallback 参数
    $.ajax({
      method: 'get',
      dataType: 'jsonp',
      url: './data/jsonp.php',
      jsonp: 'callback2',
      jsonpCallback: 'jsonpcallback',
      success: function (data, textStatus, xhr) {
        assert.equal(data.key1, 'val1');
        assert.equal(data.key2, 'val2');
        assert.equal(textStatus, 'success');
      }
    });
  });

  it('processData: false 不把数据转换为查询字符串', function () {
    $.ajax({
      method: 'post',
      data: {
        key1: 'val1',
        key2: 'val2'
      },
      url: './data/processData.php',
      processData: false,
      success: function (data) {
        assert.equal(data, 'success');
      }
    });
  });

});
