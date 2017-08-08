describe('数据存储', function () {
  it('$.data $.removeData - 在 DOM 元素上存储和删除数据', function () {
    var test = document.getElementById("test");
    test.innerHTML = '<div class="intro" data-key="val" data-key-sub="val-sub"></div>';
    var intro = test.querySelector('.intro');

    // jQuery 的 jQuery.data 不会检索 data-* 属性，但 JQ 会检索该属性
    if (!isJquery) {
      // 读取 data 属性
      assert.equal($.data(intro, 'key'), 'val');
      assert.equal($.data(intro, 'key-sub'), 'val-sub');
      assert.equal($.data(intro).key, 'val');
      assert.equal($.data(intro).keySub, 'val-sub');

      // data 属性无法通过 removeData 删除
      $.removeData(intro, 'key');
      assert.equal($.data(intro, 'key'), 'val');
    }

    // 存储字符串
    $.data(intro, 'string', 'value');
    assert.equal($.data(intro, 'string'), 'value');

    // 删除数据
    $.removeData(intro, 'string');
    assert.isUndefined($.data(intro, 'string'));

    // 存储已设置了 data 属性的数据
    $.data(intro, 'key-sub', 'testval');
    assert.equal($.data(intro, 'key-sub'), 'testval');

    // 删除了数据后，恢复为 data 属性数据
    $.removeData(intro, 'key-sub');
    if (!isJquery) {
      assert.equal($.data(intro, 'key-sub'), 'val-sub');
    } else {
      assert.isUndefined($.data(intro, 'key-sub'));
    }

    // 存储对象
    $.data(intro, 'object', {test: "test"});
    assert.deepEqual($.data(intro, 'object'), {test: "test"});

    // 存储数组
    $.data(intro, 'array', [1, 2, 3, 4]);
    assert.deepEqual($.data(intro, 'array'), [1, 2, 3, 4]);

    // 通过键值对存储多个数据
    $.data(intro, {'objkey1': 'objval1', 'objkey2': 'objval2'});
    assert.equal($.data(intro, 'objkey1'), 'objval1');
    assert.equal($.data(intro, 'objkey2'), 'objval2');

    // 获取所有数据
    if (!isJquery) {
      assert.deepEqual($.data(intro), {
        array: [1, 2, 3, 4],
        key: 'val',
        keySub: 'val-sub',
        object: {test: 'test'},
        objkey1: 'objval1',
        objkey2: 'objval2'
      });
    } else {
      assert.deepEqual($.data(intro), {
        array: [1, 2, 3, 4],
        object: {test: 'test'},
        objkey1: 'objval1',
        objkey2: 'objval2'
      });
    }
  });

  it('.data .removeData - 在 JQ 对象的元素上存取和删除数据', function () {
    var test = document.getElementById("test");
    test.innerHTML = '<div class="intro" data-key="val" data-key-sub="val-sub"></div>';

    var $intro = $('#test .intro');

    // 读取 data 属性
    assert.equal($intro.data('key'), 'val');
    assert.equal($intro.data('key-sub'), 'val-sub');
    assert.equal($intro.data().key, 'val');
    assert.equal($intro.data().keySub, 'val-sub');

    // data 属性无法通过 removeData 删除
    assert.isTrue($intro.removeData('key').is($intro));
    assert.equal($intro.data('key'), 'val');

    // 存储字符串
    assert.isTrue($intro.data('string', 'value').is($intro));
    assert.equal($intro.data('string'), 'value');

    // 删除数据
    assert.isTrue($intro.removeData('string').is($intro));
    assert.isUndefined($intro.data('string'));

    // 存储已设置了 data 属性的数据
    assert.isTrue($intro.data('key-sub', 'testval').is($intro));
    assert.equal($intro.data('key-sub'), 'testval');

    // 删除了数据后，恢复为 data 属性数据
    assert.isTrue($intro.removeData('key-sub').is($intro));
    assert.equal($intro.data('key-sub'), 'val-sub');

    // 存储对象
    assert.isTrue($intro.data('object', {test: "test"}).is($intro));
    assert.deepEqual($intro.data('object'), {test: "test"});

    // 存储数组
    assert.isTrue($intro.data('array', [1, 2, 3, 4]).is($intro));
    assert.deepEqual($intro.data('array'), [1, 2, 3, 4]);

    // 存储键值对数据
    assert.isTrue($intro.data({'objkey1': 'objval1', 'objkey2': 'objval2'}).is($intro));
    assert.equal($intro.data('objkey1'), 'objval1');
    assert.equal($intro.data('objkey2'), 'objval2');

    // 获取所有数据
    assert.deepEqual($intro.data(), {
      array: [1, 2, 3, 4],
      key: 'val',
      keySub: 'val-sub',
      object: {test: 'test'},
      objkey1: 'objval1',
      objkey2: 'objval2'
    });

    test.innerHTML = '';
  });
});
