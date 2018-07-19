describe('事件', function () {

  it('.ready() - DOM 加载完毕后执行的函数', function () {
    // $(document).ready(function(){})
    var test = $(document).ready(function(jq){
      assert.equal(jq, $);
    });
    assert.lengthOf(test, 1);
    assert.include(test.get(0), document);

    // $(function (){})
    test = $(function(jq) {
      assert.equal(jq, $);
    });
    assert.lengthOf(test, 1);
    assert.include(test.get(0), document);
  });

  it('.on() - 绑定事件监听', function () {
    var test = document.getElementById('test');
    var eventCount = 0;
    var callback = function (event) {
      eventCount++;
    };
    var callback2 = function (event) {
      eventCount = eventCount + 2;
    };

    // ====================================
    // ==================== 事件委托, $.off()
    // ====================================
    $(document).on('click', '#button', callback);
    test.innerHTML =
      '<button id="button">button</button>';
    var $button = $('#button');

    $button.trigger('click');
    assert.equal(eventCount, 1);

    // 移除事件
    $(document).off('click', '#button', callback);
    $button.trigger('click');
    assert.equal(eventCount, 1);

    // =====================================
    // ==================== 直接在元素上绑定事件
    // =====================================
    $button.on('click', callback);
    $button.trigger('click');
    assert.equal(eventCount, 2);

    $button.off('click');
    $button.trigger('click');
    assert.equal(eventCount, 2);

    // =====================================
    // =========================== data 参数
    // =====================================
    $button.on('click', {key1: 'value1', key2: 'value2'}, function (event) {
      eventCount++;

      // 原生事件的 .data 属性被占用了。因此 jQuery 使用 .data，而 JQ 使用 ._data。
      if (isJquery) {
        assert.deepEqual(event.data, {key1: 'value1', key2: 'value2'});
      } else {
        assert.deepEqual(event._data, {key1: 'value1', key2: 'value2'});
      }

    });
    $button.trigger('click');
    assert.equal(eventCount, 3);

    $button.off('click');

    // ======================================
    // =================== 使用 事件:函数 键值对
    // ======================================
    $button.on({
      'click': callback,
      'input': callback,
      'a': function () {

      }
    });
    $button.trigger('click');
    assert.equal(eventCount, 4);
    $button.trigger('input');
    assert.equal(eventCount, 5);

    $button.off('click');
    $button.trigger('click');
    assert.equal(eventCount, 5);
    $button.trigger('input');
    assert.equal(eventCount, 6);

    $button.off('input');
    $button.trigger('input');
    assert.equal(eventCount, 6);

    // =====================================
    // =========================== 自定义事件
    // =====================================
    $button.on('customEvt', callback);
    $button.trigger('customEvt');
    assert.equal(eventCount, 7);
    $button.off('customEvt');
    $button.trigger('customEvt');
    assert.equal(eventCount, 7);

    // =====================================
    // =================== 同时绑定多个处理函数
    // =====================================
    $button.on('click', callback);
    $button.on('click', callback2);
    $button.trigger('click');
    assert.equal(eventCount, 10);

    $button.off('click', callback2);
    $button.trigger('click');
    assert.equal(eventCount, 11);

    $button.off('click', callback);
    $button.trigger('click');
    assert.equal(eventCount, 11);

    $button.on('click', callback);
    $button.on('click', callback2);
    $button.trigger('click');
    assert.equal(eventCount, 14);

    $button.off('click');
    $button.trigger('click');
    assert.equal(eventCount, 14);

    $button.on('click', callback);
    $button.on('click', callback);
    $button.trigger('click');
    assert.equal(eventCount, 16);

    $button.off('click', callback);
    $button.trigger('click');
    assert.equal(eventCount, 16);

    // ====================================
    // ========== 同一个事件处理函数绑定多个事件
    // ====================================
    $button.on('click hover', callback);
    $button.trigger('click');
    assert.equal(eventCount, 17);
    $button.off('click');
    $button.trigger('click');
    assert.equal(eventCount, 17);

    $button.trigger('hover');
    assert.equal(eventCount, 18);
    $button.off('hover');
    $button.trigger('hover');
    assert.equal(eventCount, 18);

    // =====================================
    // ===================== 触发事件时传入参数
    // =====================================
    $button.on('click', function (event, data) {
      var originalData = {key1: 'value1', key2: 'value2'};
      assert.deepEqual(data, originalData);

      // mdui.JQ 的事件也会在 event.detail 存储参数，以便通过 addEventListener 监听事件时可以读取参数
      if (!isJquery) {
        assert.deepEqual(event._detail, originalData);
      }
    });
    $button.trigger('click', {key1: 'value1', key2: 'value2'});
    $button.off('click');

    // =====================================
    // ============================= 回调参数
    // =====================================
    $button.on('click', function (e) {
      assert.equal(e.type, 'click');
      assert.deepEqual(this, $button[0]);
    });
    $button.trigger('click');
    $button.off('click');

    $(document).on('click', '#button', function (e) {
      assert.equal(e.type, 'click');
      assert.deepEqual(this, $button[0]);
    });
    $button.trigger('click');
    $(document).off('click', '#button');

    $button.html('<div id="inner">inner</div>');
    $button.on('click', function (e) {
      assert.deepEqual(e.target, $('#inner')[0]);
      assert.deepEqual(this, $button[0]);
    });
    $('#inner').trigger('click');
    $button.off('click');

    $(document).on('click', '#button', function (e) {
      assert.deepEqual(e.target, $('#inner')[0]);
      assert.deepEqual(this, $button[0]);
    });
    $('#inner').trigger('click');
    $(document).off('click', '#button');

    test.innerHTML = '';
  });

  it('.one() - 绑定事件监听，仅绑定一次', function () {
    var test = document.getElementById('test');
    var eventCount = 0;
    var callback = function (event) {
      eventCount++;
    };
    var callback2 = function (event) {
      eventCount = eventCount + 2;
    };

    test.innerHTML =
      '<button id="button">button</button>';
    var $button = $('#button');

    $button.one('click', callback);
    $button.trigger('click');
    assert.equal(eventCount, 1);
    $button.trigger('click');
    assert.equal(eventCount, 1);

    $(document).one('click', '#button', callback);
    $button.trigger('click');
    assert.equal(eventCount, 2);
    $button.trigger('click');
    assert.equal(eventCount, 2);

    $button.one('click', callback);
    $button.on('click', callback2);
    $button.trigger('click');
    assert.equal(eventCount, 5);
    $button.trigger('click');
    assert.equal(eventCount, 7);
    $button.off('click');
    assert.equal(eventCount, 7);

    $button.one('click touchstart', callback);
    $button.trigger('click');
    assert.equal(eventCount, 8);
    $button.trigger('touchstart');
    assert.equal(eventCount, 9);
    $button.trigger('click');
    assert.equal(eventCount, 9);
    $button.trigger('touchstart');
    assert.equal(eventCount, 9);

    $button.one({
      'click touchstart': callback
    });
    $button.trigger('click');
    assert.equal(eventCount, 10);
    $button.trigger('touchstart');
    assert.equal(eventCount, 11);
    $button.trigger('click');
    assert.equal(eventCount, 11);
    $button.trigger('touchstart');
    assert.equal(eventCount, 11);

    test.innerHTML = '';
  });

  it('.off() - 解绑事件', function () {
    // .on() 通过即可
  });

  it('.trigger() - 触发事件', function () {
    // .on() 通过即可
  })
});
