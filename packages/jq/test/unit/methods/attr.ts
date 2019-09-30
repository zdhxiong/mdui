import $ from '../../jq_or_jquery';

describe('.attr()', function() {
  beforeEach(function() {
    $('#test').html(`
<div id="div" mdui="test" title="hello" label="world" meta="hhh" hello="no"></div>
<input id="checkbox" type="checkbox" checked="checked" hello="noo"/>
    `);
  });

  // 设置元素的属性
  it('.attr(name, value)', function() {
    const $div = $('#div');
    const $checkbox = $('#checkbox');

    const $divResult = $div
      .attr('mdui', 'value')
      .attr('max', 99)
      .attr('title', null)
      .attr('label', undefined);

    chai.assert.deepEqual($divResult, $div);
    chai.assert.equal($div.attr('mdui'), 'value');
    chai.assert.equal($div.attr('max'), '99');
    chai.assert.isUndefined($div.attr('title'));
    chai.assert.equal($div.attr('label'), 'world');
    chai.assert.isUndefined($div.attr('notfound'));

    $div.add($checkbox).attr('hello', 'world');
    chai.assert.equal($div.attr('hello'), 'world');
    chai.assert.equal($checkbox.attr('hello'), 'world');
  });

  // 通过回调函数设置元素的属性
  it('.attr(name, callback)', function() {
    const $div = $('#div');
    const $checkbox = $('#checkbox');

    const cbThis: HTMLElement[] = [];
    const cbIndex: number[] = [];
    const cbOldValue: string[] = [];

    const $divResult = $div
      .attr('mdui', function(_, oldValue) {
        return oldValue + ' value';
      })
      .attr('min', function() {
        return 11;
      })
      .attr('meta', function() {
        return null;
      })
      .attr('title', function() {
        return;
      })
      .attr('label', function(index, oldValue) {
        cbThis.push(this);
        cbIndex.push(index);
        cbOldValue.push(oldValue);

        return undefined;
      });

    chai.assert.deepEqual($divResult, $div);
    chai.assert.sameOrderedMembers(cbThis, [$divResult[0]]);
    chai.assert.sameOrderedMembers(cbIndex, [0]);
    chai.assert.sameOrderedMembers(cbOldValue, ['world']);
    chai.assert.equal($div.attr('mdui'), 'test value');
    chai.assert.equal($div.attr('min'), '11');
    chai.assert.isUndefined($div.attr('meta'));
    chai.assert.equal($div.attr('title'), 'hello');
    chai.assert.equal($div.attr('label'), 'world');
    chai.assert.isUndefined($div.attr('notfound'));

    $div.add($checkbox).attr('hello', function(_, oldAttr) {
      return oldAttr + 'world';
    });
    chai.assert.equal($div.attr('hello'), 'noworld');
    chai.assert.equal($checkbox.attr('hello'), 'nooworld');
  });

  // 同时设置多个属性
  it('.attr(object)', function() {
    const $div = $('#div');
    const $divResult = $div.attr({
      mdui: 'value',
      max: 99,
      title: null,
    });

    chai.assert.deepEqual($divResult, $div);
    chai.assert.equal($div.attr('mdui'), 'value');
    chai.assert.equal($div.attr('max'), '99');
    chai.assert.isUndefined($div.attr('title'));
    chai.assert.isUndefined($div.attr('notfound'));
  });

  // 通过回调函数同时设置多个元素的值
  it('.attr(object)', function() {
    const $div = $('#div');

    const cbThis: HTMLElement[] = [];
    const cbIndex: number[] = [];
    const cbOldValue: string[] = [];

    const $divResult = $div.attr({
      mdui: function(_, oldValue) {
        return oldValue + ' value';
      },
      min: function() {
        return 11;
      },
      meta: function() {
        return null;
      },
      title: function() {
        return;
      },
      label: function(index, oldValue) {
        cbThis.push(this);
        cbIndex.push(index);
        cbOldValue.push(oldValue);

        return undefined;
      },
    });

    chai.assert.deepEqual($divResult, $div);
    chai.assert.sameOrderedMembers(cbThis, [$divResult[0]]);
    chai.assert.sameOrderedMembers(cbIndex, [0]);
    chai.assert.sameOrderedMembers(cbOldValue, ['world']);
    chai.assert.equal($div.attr('mdui'), 'test value');
    chai.assert.equal($div.attr('min'), '11');
    chai.assert.isUndefined($div.attr('meta'));
    chai.assert.equal($div.attr('title'), 'hello');
    chai.assert.equal($div.attr('label'), 'world');
    chai.assert.isUndefined($div.attr('notfound'));
  });

  // 获取第一个元素的属性值
  it('.attr(name)', function() {
    const $div = $('#div');
    const $checkbox = $('#checkbox');

    chai.assert.equal($div.attr('mdui'), 'test');
    chai.assert.equal($checkbox.attr('checked'), 'checked');
  });
});
