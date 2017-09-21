/**
 * =============================================================================
 * ************   Mutation   ************
 * =============================================================================
 */

(function () {
  /**
   * API 初始化代理, 当 DOM 突变再次执行代理的初始化函数. 使用方法:
   *
   * 1. 代理组件 API 执行初始化函数, selector 必须为字符串.
   *    mdui.mutation(selector, apiInit);
   *    mutation 会执行 $(selector).each(apiInit)
   *
   * 2. 突变时, 再次执行代理的初始化函数
   *    mdui.mutation()        等价 $(document).mutation()
   *    $(selector).mutation() 在 selector 节点内进行 API 初始化
   *
   * 原理:
   *
   *    mutation 执行了 $().data('mdui.mutation', [selector]).
   *    当元素被重构时, 该数据会丢失, 由此判断是否突变.
   *
   * 提示:
   *
   *    类似 Drawer 可以使用委托事件完成.
   *    类似 Collapse 需要知道 DOM 发生突变, 并再次进行初始化.
   */
  var entries = { };

  function mutation(selector, apiInit, that, i, item) {
    var $this = $(that);
    var m = $this.data('mdui.mutation');

    if (!m) {
      m = [];
      $this.data('mdui.mutation', m);
    }

    if (m.indexOf(selector) === -1) {
      m.push(selector);
      apiInit.call(that, i, item);
    }
  }

  $.fn.extend({
    mutation: function () {
      return this.each(function (i, item) {
        var $this = $(this);
        $.each(entries, function (selector, apiInit) {
          if ($this.is(selector)) {
            mutation(selector, apiInit, $this[0], i, item);
          }

          $this.find(selector).each(function (i, item) {
            mutation(selector, apiInit, this, i, item);
          });
        });
      });
    },
  });

  mdui.mutation = function (selector, apiInit) {
    if (typeof selector !== 'string' || typeof apiInit !== 'function') {
      $(document).mutation();
      return;
    }

    entries[selector] = apiInit;
    $(selector).each(function (i, item) {
      mutation(selector, apiInit, this, i, item);
    });
  };

})();
