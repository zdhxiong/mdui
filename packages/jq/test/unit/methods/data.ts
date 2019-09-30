import $ from '../../jq_or_jquery';

describe('.data(), .removeData()', function() {
  beforeEach(function() {
    $('#test').html(
      '<div class="intro" data-key="val" data-key-sub="val-sub"></div>',
    );
  });

  // 在当前元素上存储数据
  it('.data(key: string, value: any): JQ', function() {
    const $intro = $('.intro');

    // 存储字符串
    chai.assert.isTrue($intro.data('string', 'value').is($intro));
    chai.assert.equal($intro.data('string'), 'value');

    // 存储对象
    $intro.data('object', { test: 'test' });
    chai.assert.deepEqual($intro.data('object'), { test: 'test' });

    // 存储数组
    $intro.data('array', [1, 2, 3, 4]);
    chai.assert.sameOrderedMembers($intro.data('array'), [1, 2, 3, 4]);
  });

  // 使用键值对在当前元素上存储数据
  it('.data(object): JQ', function() {
    const $intro = $('.intro');

    $intro.data({ objkey1: 'objval1', objkey2: 'objval2' });
    chai.assert.equal($intro.data('objkey1'), 'objval1');
    chai.assert.equal($intro.data('objkey2'), 'objval2');
  });

  // 获取在当前元素上存储的数据
  it('.data(key: string): any', function() {
    const $intro = $('.intro');

    $intro.data('test', 'value');

    chai.assert.equal($intro.data('key'), 'val');
    chai.assert.equal($intro.data('key-sub'), 'val-sub');
    chai.assert.equal($intro.data('test'), 'value');
  });

  // 获取在当前元素上存储的所有数据
  it('.data(): object', function() {
    const $intro = $('.intro');

    $intro.data({
      array: [1, 2, 3],
      object: { test1: 'val1', test2: 'val2' },
      key1: 'value1',
    });

    $intro.data('key2', 'value2');

    const data = $intro.data();

    chai.assert.deepEqual(data, {
      key: 'val',
      keySub: 'val-sub',
      array: [1, 2, 3],
      object: { test1: 'val1', test2: 'val2' },
      key1: 'value1',
      key2: 'value2',
    });
  });

  it('.removeData(key: string): JQ', function() {
    const $intro = $('.intro');

    // data-* 属性无法通过 removeData 删除
    chai.assert.isTrue($intro.removeData('key').is($intro));
    chai.assert.equal($intro.data('key'), 'val');

    // 移除通过 .data() 方法设置的数据
    $intro.data('string', 'value');
    $intro.removeData('string');
    chai.assert.isUndefined($intro.data('string'));

    // 存储已设置了 data 属性的数据，删除数据后，恢复为 data-* 的数据
    $intro.data('key-sub', 'testval');
    chai.assert.equal($intro.data('key-sub'), 'testval');
    $intro.removeData('key-sub');
    chai.assert.equal($intro.data('key-sub'), 'val-sub');
  });

  it('.removeData(): JQ', function() {
    const $intro = $('.intro');

    $intro.data('string', 'value');
    $intro.data('array', [1, 2]);
    $intro.data('object', { test: 'value' });

    $intro.removeData();

    chai.assert.deepEqual($intro.data(), {
      key: 'val',
      keySub: 'val-sub',
    });
  });
});
