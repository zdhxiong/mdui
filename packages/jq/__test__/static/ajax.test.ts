import Pretender from 'pretender';
import { EventParams } from '../../shared/ajax.js';
import { assert, jq, JQStatic, jQuery } from '../utils.js';
import '../../methods/on.js';
import '../../methods/off.js';
import '../../static/ajax.js';
import '../../static/ajaxSetup.js';

// mock 服务，模拟 REST API
const mockAPI = () => {
  new Pretender(function () {
    // 返回纯文本
    this.get('/get_text', () => {
      return [200, {}, 'is a text'];
    });

    // 404
    this.get('/not_fount', () => {
      return [404, {}, ''];
    });

    // timeout
    this.get(
      '/timeout',
      () => {
        return [200, {}, ''];
      },
      2000,
    );

    // 所有请求类型的参数提交
    this.get('/request_body', (request) => {
      if (
        request.queryParams.key1 === 'val1' &&
        request.queryParams.key2 === 'val2'
      ) {
        return [200, {}, 'get'];
      }

      return [200, {}, '参数值错误'];
    });
    this.post('/request_body', (request) => {
      if (request.requestBody === 'key1=val1&key2=val2') {
        return [200, {}, 'post'];
      }

      return [200, {}, '参数值错误'];
    });
    this.put('/request_body', (request) => {
      if (request.requestBody === 'key1=val1&key2=val2') {
        return [200, {}, 'put'];
      }

      return [200, {}, '参数值错误'];
    });
    this.delete('/request_body', (request) => {
      if (request.requestBody === 'key1=val1&key2=val2') {
        return [200, {}, 'delete'];
      }

      return [200, {}, '参数值错误'];
    });
    this.head('/request_body', (request) => {
      if (
        request.queryParams.key1 === 'val1' &&
        request.queryParams.key2 === 'val2'
      ) {
        return [200, {}, 'head'];
      }

      return [200, {}, '参数值错误'];
    });
    this.options('/request_body', (request) => {
      if (request.requestBody === 'key1=val1&key2=val2') {
        return [200, {}, 'options'];
      }

      return [200, {}, '参数值错误'];
    });
    this.patch('/request_body', (request) => {
      if (request.requestBody === 'key1=val1&key2=val2') {
        return [200, {}, 'patch'];
      }

      return [200, {}, '参数值错误'];
    });

    // 返回 json 字符串，不指定响应头
    this.get('/json_string', () => {
      return [
        200,
        {},
        JSON.stringify({
          key1: 'val1',
          key2: 'val2',
        }),
      ];
    });

    // 返回 json 字符串，指定响应头
    this.get('/json_object', () => {
      return [
        200,
        { 'Content-Type': 'application/json' },
        JSON.stringify({
          key1: 'val1',
          key2: 'val2',
        }),
      ];
    });

    // 返回错误的 json 格式
    this.get('/json_error', () => {
      return [
        200,
        { 'Content-Type': 'application/json' },
        '{"key1": "val1", "key2": "v}',
      ];
    });

    // processData 为 false 时
    this.post('/processData', (request) => {
      if (
        // @ts-ignore
        request.requestBody.key1 === 'val1' &&
        // @ts-ignore
        request.requestBody.key2 === 'val2'
      ) {
        return [200, {}, 'success'];
      }

      return [200, {}, '参数值错误'];
    });
  });
};
mockAPI();

const test = ($: JQStatic, type: string): void => {
  /**
   * 回调函数顺序为 beforeSend -> success|error -> statusCode -> complete
   */
  describe(`${type} - $.ajax`, () => {
    afterEach(() => {
      $(document).off();
    });

    const isJquery = type === 'jQuery';

    // 禁止触发全局事件，避免影响全局事件的测试
    $.ajaxSetup({
      global: false,
    });

    it('GET 请求，请求成功，返回 text，测试回调函数参数、全局事件、事件触发顺序', () => {
      // 用于测试事件触发顺序
      let eventStart = 0;
      let eventSuccess = 0;
      let eventError = 0;
      let eventComplete = 0;

      // ==============================================
      // 事件监听
      // ==============================================
      // event: 事件对象
      // data: {
      //   xhr: XMLHttpRequest 对象
      //   options: AJAX 请求的配置参数
      //   response: AJAX 请求返回的数据，仅 ajaxSuccess 事件存在
      // }
      $(document).on('ajaxStart', (event, data: EventParams) => {
        if (!isJquery) {
          assert.instanceOf(data.xhr, XMLHttpRequest);
          assert.isObject(data.options);
          assert.equal(data.options.method, 'GET');
          assert.isUndefined(data.response);
          // @ts-ignore
          assert.instanceOf(event._detail.xhr, XMLHttpRequest);
        }

        eventStart++;
        assert.equal(eventStart, 1);
        assert.equal(eventSuccess, 0);
        assert.equal(eventError, 0);
        assert.equal(eventComplete, 0);
      });

      $(document).on('ajaxSuccess', (event, data: EventParams) => {
        if (!isJquery) {
          assert.instanceOf(data.xhr, XMLHttpRequest);
          assert.isObject(data.options);
          assert.equal(data.options.method, 'GET');
          assert.equal(data.response, 'is a text');
          // @ts-ignore
          assert.instanceOf(event._detail.xhr, XMLHttpRequest);
        }

        eventSuccess++;
        assert.equal(eventStart, 1);
        assert.equal(eventSuccess, 1);
        assert.equal(eventError, 0);
        assert.equal(eventComplete, 0);
      });

      $(document).on('ajaxError', (event, data: EventParams) => {
        if (!isJquery) {
          assert.instanceOf(data.xhr, XMLHttpRequest);
          assert.isObject(data.options);
          assert.equal(data.options.method, 'GET');
          assert.isUndefined(data.response);
          // @ts-ignore
          assert.instanceOf(event._detail.xhr, XMLHttpRequest);
        }

        eventError++;
      });

      $(document).on('ajaxComplete', (event, data: EventParams) => {
        if (!isJquery) {
          assert.instanceOf(data.xhr, XMLHttpRequest);
          assert.isObject(data.options);
          assert.equal(data.options.method, 'GET');
          assert.isUndefined(data.response);
          // @ts-ignore
          assert.instanceOf(event._detail.xhr, XMLHttpRequest);
        }

        eventComplete++;
        assert.equal(eventStart, 1);
        assert.equal(eventSuccess, 1);
        assert.equal(eventError, 0);
        assert.equal(eventComplete, 1);
      });

      // =========================
      // ============== 原生事件监听，仅 @mdui/jq 支持
      // =========================
      // event: 事件对象
      // event.detail: {
      //   xhr: XMLHttpRequest 对象
      //   options: AJAX 请求的配置参数
      //   response: AJAX 请求返回的数据，仅 ajaxSuccess 事件存在
      // }
      document.addEventListener('ajaxStart', (event) => {
        // @ts-ignore
        assert.instanceOf(event._detail.xhr, XMLHttpRequest);
        // @ts-ignore
        assert.isObject(event._detail.options);
        // @ts-ignore
        assert.isUndefined(event._detail.response);
      });

      document.addEventListener('ajaxSuccess', (event) => {
        // @ts-ignore
        assert.instanceOf(event._detail.xhr, XMLHttpRequest);
        // @ts-ignore
        assert.isObject(event._detail.options);
        // @ts-ignore
        assert.exists(event._detail.response);
      });

      document.addEventListener('ajaxError', (event) => {
        // @ts-ignore
        assert.instanceOf(event._detail.xhr, XMLHttpRequest);
        // @ts-ignore
        assert.isObject(event._detail.options);
        // @ts-ignore
        assert.isUndefined(event._detail.response);
      });

      document.addEventListener('ajaxComplete', (event) => {
        // @ts-ignore
        assert.instanceOf(event._detail.xhr, XMLHttpRequest);
        // @ts-ignore
        assert.isObject(event._detail.options);
        // @ts-ignore
        assert.isUndefined(event._detail.response);
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
        url: `/get_text`,
        global: true,
        beforeSend: (xhr, options) => {
          callbackBeforeSend++;
          assert.equal(callbackBeforeSend, 1);
          assert.equal(callbackSuccess, 0);
          assert.equal(callbackError, 0);
          assert.equal(callbackStatusCode404, 0);
          assert.equal(callbackStatusCode200, 0);
          assert.equal(callbackComplete, 0);

          if (!isJquery) {
            assert.instanceOf(xhr, XMLHttpRequest);
            assert.isObject(options);
          }
        },
        success: (response, textStatus, xhr) => {
          callbackSuccess++;
          assert.equal(callbackBeforeSend, 1);
          assert.equal(callbackSuccess, 1);
          assert.equal(callbackError, 0);
          assert.equal(callbackStatusCode404, 0);
          assert.equal(callbackStatusCode200, 0);
          assert.equal(callbackComplete, 0);

          assert.equal(response, 'is a text');
          assert.equal(textStatus, 'success');
          if (!isJquery) {
            assert.instanceOf(xhr, XMLHttpRequest);
          }
        },
        error: () => {
          callbackError++;
        },
        statusCode: {
          404: () => {
            callbackStatusCode404++;
          },
          200: (response, textStatus, xhr) => {
            callbackStatusCode200++;
            assert.equal(callbackBeforeSend, 1);
            assert.equal(callbackSuccess, 1);
            assert.equal(callbackError, 0);
            assert.equal(callbackStatusCode404, 0);
            assert.equal(callbackStatusCode200, 1);
            assert.equal(callbackComplete, 0);

            assert.equal(response, 'is a text');
            assert.equal(textStatus, 'success');

            if (!isJquery) {
              assert.instanceOf(xhr, XMLHttpRequest);
            }
          },
        },
        complete: (xhr, textStatus) => {
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
      }).then((response) => {
        assert.equal(response, 'is a text');
      });

      if (!isJquery) {
        assert.instanceOf(promise, Promise);
      }

      return promise;
    });

    it('GET 请求，请求返回 404，测试回调函数参数，全局事件', () => {
      // 用于测试事件触发顺序
      let eventStart = 0;
      let eventSuccess = 0;
      let eventError = 0;
      let eventComplete = 0;

      // ==============================================
      // 事件监听
      // ==============================================
      $(document).on('ajaxStart', () => {
        eventStart++;
        assert.equal(eventStart, 1);
        assert.equal(eventSuccess, 0);
        assert.equal(eventError, 0);
        assert.equal(eventComplete, 0);
      });

      $(document).on('ajaxSuccess', () => {
        eventSuccess++;
      });

      $(document).on('ajaxError', () => {
        eventError++;
        assert.equal(eventStart, 1);
        assert.equal(eventSuccess, 0);
        assert.equal(eventError, 1);
        assert.equal(eventComplete, 0);
      });

      $(document).on('ajaxComplete', () => {
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
          url: '/not_fount',
          global: true,
          beforeSend: () => {
            callbackBeforeSend++;
            assert.equal(callbackBeforeSend, 1);
            assert.equal(callbackSuccess, 0);
            assert.equal(callbackError, 0);
            assert.equal(callbackStatusCode404, 0);
            assert.equal(callbackStatusCode200, 0);
            assert.equal(callbackComplete, 0);
          },
          success: () => {
            callbackSuccess++;
            reject('error');
          },
          error: (xhr, textStatus) => {
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
            404: (xhr) => {
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
            200: () => {
              callbackStatusCode200++;
            },
          },
          complete: (xhr, textStatus) => {
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
          .then(() => {
            reject('not found');
          })
          .catch(function () {
            resolve();
          });
      });
    });

    it('beforeSend 回调中返回 false 来取消 Ajax 请求', () => {
      return new Promise<void>((resolve, reject) => {
        $.ajax({
          method: 'get',
          url: '/get_text',
          beforeSend: () => {
            return false;
          },
        })
          .then(() => {
            reject('cancel');
          })
          .catch(() => {
            resolve();
          });
      });
    });

    it('GET 请求，请求超时', () => {
      return new Promise<void>((resolve, reject) => {
        $.ajax({
          method: 'get',
          url: '/timeout',
          timeout: 1000,
          error: () => {
            resolve();
          },
          success: () => {
            reject('timeout');
          },
        })
          .then(() => {
            reject('timeout');
          })
          .catch(() => {
            resolve();
          });
      });
    });

    it('所有请求，提交参数', () => {
      return (
        // get 请求提交查询字符串参数
        $.ajax({
          method: 'get',
          url: '/request_body',
          data: 'key1=val1&key2=val2',
          success: (response, textStatus, xhr) => {
            assert.equal(response, 'get');
            assert.equal(textStatus, 'success');
            if (!isJquery) {
              assert.instanceOf(xhr, XMLHttpRequest);
            }
          },
          error: () => {
            assert.isTrue(false);
          },
        })
          .then((response) => {
            assert.equal(response, 'get');
          })
          // get 请求提交对象参数
          .then(() =>
            $.ajax({
              method: 'get',
              url: '/request_body',
              data: {
                key1: 'val1',
                key2: 'val2',
              },
              success: (response, textStatus, xhr) => {
                assert.equal(response, 'get');
                assert.equal(textStatus, 'success');
                if (!isJquery) {
                  assert.instanceOf(xhr, XMLHttpRequest);
                }
              },
              error: () => {
                assert.isTrue(false);
              },
            }),
          )
          .then((response) => {
            assert.equal(response, 'get');
          })
          .then(() =>
            $.ajax({
              method: 'post',
              url: '/request_body',
              data: {
                key1: 'val1',
                key2: 'val2',
              },
              success: (response, textStatus, xhr) => {
                assert.equal(response, 'post');
                assert.equal(textStatus, 'success');
                if (!isJquery) {
                  assert.instanceOf(xhr, XMLHttpRequest);
                }
              },
              error: () => {
                assert.isTrue(false);
              },
            }),
          )
          .then((data) => {
            assert.equal(data, 'post');
          })
          .then(() =>
            $.ajax({
              method: 'put',
              url: '/request_body',
              data: {
                key1: 'val1',
                key2: 'val2',
              },
              success: (response, textStatus, xhr) => {
                assert.equal(response, 'put');
                assert.equal(textStatus, 'success');
                if (!isJquery) {
                  assert.instanceOf(xhr, XMLHttpRequest);
                }
              },
              error: () => {
                assert.isTrue(false);
              },
            }),
          )
          .then((response) => {
            assert.equal(response, 'put');
          })
          .then(() =>
            $.ajax({
              method: 'delete',
              url: '/request_body',
              data: {
                key1: 'val1',
                key2: 'val2',
              },
              success: (response, textStatus, xhr) => {
                assert.equal(response, 'delete');
                assert.equal(textStatus, 'success');
                if (!isJquery) {
                  assert.instanceOf(xhr, XMLHttpRequest);
                }
              },
              error: () => {
                assert.isTrue(false);
              },
            }),
          )
          .then((response) => {
            assert.equal(response, 'delete');
          })
          .then(() =>
            $.ajax({
              method: 'head',
              url: '/request_body',
              data: {
                key1: 'val1',
                key2: 'val2',
              },
              success: (response, textStatus, xhr) => {
                assert.isUndefined(response);
                assert.equal(textStatus, 'nocontent');
                if (!isJquery) {
                  assert.instanceOf(xhr, XMLHttpRequest);
                }
              },
              error: () => {
                assert.isTrue(false);
              },
            }),
          )
          .then((response) => {
            assert.isUndefined(response);
          })
          .then(() =>
            $.ajax({
              method: 'options',
              url: '/request_body',
              data: {
                key1: 'val1',
                key2: 'val2',
              },
              success: (response, textStatus, xhr) => {
                assert.equal(response, 'options');
                assert.equal(textStatus, 'success');
                if (!isJquery) {
                  assert.instanceOf(xhr, XMLHttpRequest);
                }
              },
              error: () => {
                assert.isTrue(false);
              },
            }),
          )
          .then((response) => {
            assert.equal(response, 'options');
          })
          .then(() => {
            return $.ajax({
              method: 'patch',
              url: '/request_body',
              data: {
                key1: 'val1',
                key2: 'val2',
              },
              success: (response, textStatus, xhr) => {
                assert.equal(response, 'patch');
                assert.equal(textStatus, 'success');
                if (!isJquery) {
                  assert.instanceOf(xhr, XMLHttpRequest);
                }
              },
              error: () => {
                assert.isTrue(false);
              },
            });
          })
          .then((response) => {
            assert.equal(response, 'patch');
          })
      );
    });

    it('获取 JSON 数据', () => {
      // 没有指定 dataType，返回 json 字符串
      return $.ajax({
        method: 'get',
        url: '/json_string',
        success: (response) => {
          assert.isString(response);
        },
      })
        .then((response) => {
          assert.isString(response);
        })
        .then(() =>
          // 指定 dataType，获取 json 字符串，自动解析成 json 对象
          $.ajax({
            method: 'get',
            url: '/json_string',
            dataType: 'json',
            success: (response) => {
              assert.isObject(response);
              assert.equal(response.key1, 'val1');
              assert.equal(response.key2, 'val2');
            },
          }),
        )
        .then((response) => {
          assert.isObject(response);
          assert.equal(response.key1, 'val1');
          assert.equal(response.key2, 'val2');
        })
        .then(() =>
          // 未指定 dataType，获取 json 对象
          $.ajax({
            method: 'get',
            url: '/json_object',
            success: (response) => {
              assert.isObject(response);
              assert.equal(response.key1, 'val1');
              assert.equal(response.key2, 'val2');
            },
          }),
        )
        .then((response) => {
          assert.isObject(response);
          assert.equal(response.key1, 'val1');
          assert.equal(response.key2, 'val2');
        })
        .then(() =>
          // 指定 dataType 为 json，获取 json 对象
          $.ajax({
            method: 'get',
            url: '/json_object',
            dataType: 'json',
            success: (response) => {
              assert.isObject(response);
              assert.equal(response.key1, 'val1');
              assert.equal(response.key2, 'val2');
            },
          }),
        )
        .then((response) => {
          assert.isObject(response);
          assert.equal(response.key1, 'val1');
          assert.equal(response.key2, 'val2');
        })
        .then(() =>
          // 指定 dataType 为 text，获取 json 对象
          $.ajax({
            method: 'get',
            url: '/json_object',
            dataType: 'text',
            success: (response) => {
              assert.isString(response);
            },
          }),
        )
        .then((response) => {
          assert.isString(response);
        })
        .then(() =>
          // json 数据格式错误
          $.ajax({
            method: 'get',
            url: '/json_error',
            dataType: 'json',
            error: (_, textStatus) => {
              assert.equal(textStatus, 'parsererror');
            },
          }),
        )
        .catch(() => {
          assert.isTrue(true);
        });
    });

    it('禁用 GET/HEAD 请求的缓存', () => {
      return $.ajax({
        method: 'get',
        url: '/request_body',
        cache: false,
        success: (_, __, xhr) => {
          if (!isJquery) {
            assert.isTrue(xhr.responseURL.indexOf('_=') > 0);
          }
        },
      })
        .then(() =>
          $.ajax({
            method: 'head',
            url: '/request_body',
            cache: false,
            success: (_, __, xhr) => {
              if (!isJquery) {
                assert.isTrue(xhr.responseURL.indexOf('_=') > 0);
              }
            },
          }),
        )
        .then(() =>
          $.ajax({
            method: 'post',
            url: '/request_body',
            cache: false,
            success: (_, __, xhr) => {
              if (!isJquery) {
                assert.isFalse(xhr.responseURL.indexOf('_=') > 0);
              }
            },
          }),
        );
    });

    it('processData: false 不把数据转换为查询字符串', () => {
      return $.ajax({
        method: 'post',
        data: {
          key1: 'val1',
          key2: 'val2',
        },
        url: '/processData',
        processData: false,
        success: (response) => {
          assert.equal(response, 'success');
        },
      }).then((response) => {
        assert.equal(response, 'success');
      });
    });
  });
};

test(jq, 'jq');
test(jQuery as unknown as JQStatic, 'jQuery');
