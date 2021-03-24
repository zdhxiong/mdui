import { assert } from 'chai';
import $ from '../../jq_or_jquery';

describe('.data(), .removeData()', function () {
  const $window = $(window);
  const $document = $(document);
  const dataObject = {
    key: 'val',
    keySub: 'val-sub',
    age: 43,
    hidden: true,
    visible: false,
    none: null,
    options: { name: 'John', age: 43 },
  };

  beforeEach(function () {
    $('#test').html(
      `<div
         class="intro"
         data-key="val"
         data-key-sub="val-sub"
         data-age="43"
         data-hidden="true"
         data-visible="false"
         data-none="null"
         data-options='{"name": "John", "age": 43}'
       ></div>`,
    );
  });

  it('.data(key, value)', function () {
    const $intro = $('.intro');
    const $empty = $();

    assert.lengthOf($empty.data('test', 'value'), 0);
    assert.isUndefined($empty.data('ggg'));

    // 在 window 上存储数据
    $window.data('string', 'value');
    assert.equal($window.data('string'), 'value');
    $window.removeData('string');
    assert.isUndefined($window.data('string'));

    // 在 document 上存储数据
    $document.data('string', 'value2');
    assert.equal($document.data('string'), 'value2');
    $document.removeData('string');
    assert.isUndefined($document.data('string'));

    // 键名转为驼峰法
    $document.data('string-sub', 'value-sub');
    assert.equal($document.data('string-sub'), 'value-sub');
    assert.equal($document.data('stringSub'), 'value-sub');
    assert.deepEqual($document.data(), { stringSub: 'value-sub' });
    $document.removeData('string-sub');
    assert.isUndefined($document.data('string-sub'));
    assert.isUndefined($document.data('stringSub'));

    // 存储字符串
    assert.isTrue($intro.data('string', 'value').is($intro));
    assert.equal($intro.data('string'), 'value');

    // 存储对象
    const testObject = { test1: 'test1', test2: 'test2' };
    $intro.data('object', testObject);
    assert.deepEqual($intro.data('object'), testObject);

    // 再次存储相同键名的对象
    $intro.data('object', { test1: 'aa', test2: 'bb' });
    assert.deepEqual($intro.data('object'), { test1: 'aa', test2: 'bb' });

    // 存储数组
    const testArrayData = [1, 2, 3, 4];
    $intro.data('array', testArrayData);
    assert.sameOrderedMembers($intro.data('array'), testArrayData);

    // .data(key, undefined) 不设置数据，直接返回原对象
    assert.isTrue($intro.data('array', undefined).is($intro));
    assert.sameOrderedMembers($intro.data('array'), testArrayData);

    // .data(key, null) 将存储 null 值
    assert.isTrue($intro.data('array', null).is($intro));
    assert.deepEqual($intro.data('array'), null);
  });

  it('.data(object): JQ', function () {
    const $intro = $('.intro');

    assert.deepEqual($intro.data(), dataObject);

    const otherObject = {
      objkey1: 'objval1',
      'obj-key2': 'objval2',
    };

    $intro.data(otherObject);
    assert.deepEqual(
      $intro.data(),
      $.extend({ objkey1: 'objval1', objKey2: 'objval2' }, dataObject),
    );

    assert.equal($intro.data('objkey1'), 'objval1');
    assert.equal($intro.data('obj-key2'), 'objval2');
    assert.equal($intro.data('objKey2'), 'objval2');
  });

  // 获取在当前元素上存储的数据
  it('.data(key: string): any', function () {
    const $intro = $('.intro');

    $intro.data('test', 'value');

    assert.equal($intro.data('test'), 'value');
    assert.equal($intro.data('key'), 'val');
    assert.equal($intro.data('key-sub'), 'val-sub');
    assert.equal($intro.data('keySub'), 'val-sub');
    assert.deepEqual($intro.data('age'), 43);
    assert.isTrue($intro.data('hidden'));
    assert.isFalse($intro.data('visible'));
    assert.deepEqual($intro.data('options'), { name: 'John', age: 43 });
    assert.isUndefined($intro.data('dddd'));
  });

  it('.removeData(key: string): JQ', function () {
    const $intro = $('.intro');

    // data-* 属性无法通过 removeData 删除
    assert.isTrue($intro.removeData('key').is($intro));
    assert.equal($intro.data('key'), 'val');

    // 移除通过 .data() 方法设置的数据
    $intro.data('string', 'value');
    $intro.removeData('string');
    assert.isUndefined($intro.data('string'));

    // 存储已设置了 data 属性的数据，删除数据后，恢复为 data-* 的数据
    $intro.data('key-sub', 'testval');
    assert.equal($intro.data('key-sub'), 'testval');
    $intro.removeData('key-sub');
    assert.equal($intro.data('key-sub'), 'val-sub');
  });

  it('.removeData(): JQ', function () {
    const $intro = $('.intro');

    $intro.data('string', 'value');
    $intro.data('array', [1, 2]);
    $intro.data('object', { test: 'value' });

    $intro.removeData();

    assert.deepEqual($intro.data(), dataObject);
  });
});
