import $ from '../../jq_or_jquery';

describe('.css()', function() {
  beforeEach(function() {
    $('#test').html(
      '<div id="div" style="width: 100px;font-size: 20px;height: 100px;"></div>',
    );
  });

  // 设置元素的样式
  it('.css(name, value)', function() {
    const $div = $('#div');

    const $divResult = $div
      .css('width', '200px')
      .css('line-height', '20px')
      .css('font-size', undefined)
      .css('height', 50)
      .css('opacity', 0.6);

    chai.assert.deepEqual($divResult, $div);
    chai.assert.equal($div.css('width'), '200px');
    chai.assert.equal($div.css('line-height'), '20px');
    chai.assert.equal($div.css('font-size'), '20px');
    chai.assert.equal($div.css('height'), '50px');
    chai.assert.equal($div.css('opacity'), '0.6');
  });

  // 通过回调函数设置元素的样式
  it('.css(name, callback)', function() {
    const $div = $('#div');

    const cbThis: HTMLElement[] = [];
    const cbIndex: number[] = [];
    const cbOldValue: string[] = [];

    const $divResult = $div
      .css('width', function(index, oldValue) {
        cbThis.push(this);
        cbIndex.push(index);
        cbOldValue.push(oldValue);

        return;
      })
      .css('line-height', function() {
        return '20px';
      })
      .css('font-size', function() {
        return undefined;
      })
      .css('height', function() {
        return 50;
      })
      .css('opacity', function() {
        return 0.6;
      });

    chai.assert.deepEqual($divResult, $div);
    chai.assert.sameOrderedMembers(cbThis, [$div[0]]);
    chai.assert.sameOrderedMembers(cbIndex, [0]);
    chai.assert.sameOrderedMembers(cbOldValue, ['100px']);
    chai.assert.equal($div.css('width'), '100px');
    chai.assert.equal($div.css('line-height'), '20px');
    chai.assert.equal($div.css('font-size'), '20px');
    chai.assert.equal($div.css('height'), '50px');
    chai.assert.equal($div.css('opacity'), '0.6');
  });

  // 同时设置多个样式
  it('.css(object)', function() {
    const $div = $('#div');

    const $divResult = $div.css({
      width: '200px',
      lineHeight: '20px',
      fontSize: undefined,
      height: 50,
      opacity: 0.6,
    });

    chai.assert.deepEqual($divResult, $div);
    chai.assert.equal($div.css('width'), '200px');
    chai.assert.equal($div.css('line-height'), '20px');
    chai.assert.equal($div.css('font-size'), '20px');
    chai.assert.equal($div.css('height'), '50px');
    chai.assert.equal($div.css('opacity'), '0.6');
  });

  // 通过回调函数同时设置多个样式
  it('.css(object)', function() {
    const $div = $('#div');

    const cbThis: HTMLElement[] = [];
    const cbIndex: number[] = [];
    const cbOldValue: string[] = [];

    const $divResult = $div.css({
      width: function(index, oldValue) {
        cbThis.push(this);
        cbIndex.push(index);
        cbOldValue.push(oldValue);

        return;
      },
      'line-height': function() {
        return '20px';
      },
      'font-size': function() {
        return undefined;
      },
      height: function() {
        return 50;
      },
      opacity: function() {
        return 0.6;
      },
    });

    chai.assert.deepEqual($divResult, $div);
    chai.assert.sameOrderedMembers(cbThis, [$div[0]]);
    chai.assert.sameOrderedMembers(cbIndex, [0]);
    chai.assert.sameOrderedMembers(cbOldValue, ['100px']);
    chai.assert.equal($div.css('width'), '100px');
    chai.assert.equal($div.css('line-height'), '20px');
    chai.assert.equal($div.css('font-size'), '20px');
    chai.assert.equal($div.css('height'), '50px');
    chai.assert.equal($div.css('opacity'), '0.6');
  });

  // 获取第一个元素的样式
  it('.css(name)', function() {
    const $div = $('#div');

    chai.assert.equal($div.css('width'), '100px');
    chai.assert.equal($div.css('font-size'), '20px');
    chai.assert.equal($div.css('display'), 'block');
  });
});
