import $ from '../../jq_or_jquery';

describe('.addClass()', function() {
  beforeEach(function() {
    $('#test').html(`
<div id="foo">Hello</div>
<div id="bar">World</div>
    `);
  });

  it('.addClass(name)', function() {
    const $foo = $('#foo');
    chai.assert.isUndefined($foo.attr('class'));

    // 添加空字符
    $foo.addClass('');
    chai.assert.isUndefined($foo.attr('class'));

    // 添加一个类
    // 返回 JQ
    const $result = $foo.addClass('mdui');
    chai.assert.deepEqual($result, $foo);
    chai.assert.equal($foo.attr('class'), 'mdui');

    // 添加多个类，用空格分隔
    $foo.addClass('mdui1  mdui2');
    chai.assert.equal($foo.attr('class'), 'mdui mdui1 mdui2');
  });

  it('.addClass(callback)', function() {
    const $foo = $('#foo');
    const $bar = $('#bar');

    // 函数的 this 指向，参数验证
    let _this;
    let _i;
    let _currentClassName;
    $foo.addClass('mdui1 mdui2');
    $foo.addClass(function(i, currentClassName) {
      _this = this;
      _i = i;
      _currentClassName = currentClassName;

      return '';
    });

    chai.assert.deepEqual(_this, $foo[0]);
    chai.assert.equal(_i, 0);
    chai.assert.equal(_currentClassName, 'mdui1 mdui2');

    // 通过函数返回类
    $foo.addClass(function() {
      return 'mdui3';
    });
    chai.assert.equal($foo.attr('class'), 'mdui1 mdui2 mdui3');

    // 通过函数返回多个类
    $foo.addClass(function() {
      return 'mdui4 mdui5  mdui6';
    });
    chai.assert.equal(
      $foo.attr('class'),
      'mdui1 mdui2 mdui3 mdui4 mdui5 mdui6',
    );

    // 函数返回不同的值
    $('#test div').addClass(function(index) {
      return `item-${index}`;
    });
    chai.assert.isTrue($foo.hasClass('item-0'));
    chai.assert.isFalse($foo.hasClass('item-1'));
    chai.assert.isFalse($bar.hasClass('item-0'));
    chai.assert.isTrue($bar.hasClass('item-1'));
  });
});
