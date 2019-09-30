import $ from '../../jq_or_jquery';

describe('.toggleClass()', function() {
  beforeEach(function() {
    $('#test').html(`
<div id="foo" class="mdui">Hello</div>
<div id="bar">World</div>
    `);
  });

  it('.toggleClass(name)', function() {
    const $foo = $('#foo');
    chai.assert.equal($foo.attr('class'), 'mdui');

    // 切换空类
    $foo.toggleClass('');
    chai.assert.equal($foo.attr('class'), 'mdui');

    // 切换一个类
    // 返回 JQ
    const $result = $foo.toggleClass('box1');
    chai.assert.deepEqual($result, $foo);
    chai.assert.equal($foo.attr('class'), 'mdui box1');

    // 切换多个类，用空格分隔
    $foo.toggleClass('box1 box2');
    chai.assert.equal($foo.attr('class'), 'mdui box2');
  });

  it('.toggleClass(callback)', function() {
    const $foo = $('#foo');
    const $bar = $('#bar');

    // 函数的 this 指向，参数验证
    let _this;
    let _i;
    let _currentClassName;
    $foo.toggleClass(function(i, currentClassName) {
      _this = this;
      _i = i;
      _currentClassName = currentClassName;

      return '';
    });

    chai.assert.deepEqual(_this, $foo[0]);
    chai.assert.equal(_i, 0);
    chai.assert.equal(_currentClassName, 'mdui');

    // 通过函数返回类
    $foo.toggleClass(function() {
      return 'mdui1';
    });
    chai.assert.equal($foo.attr('class'), 'mdui mdui1');

    // 通过函数返回多个类
    $foo.toggleClass(function() {
      return 'mdui1  mdui2';
    });
    chai.assert.equal($foo.attr('class'), 'mdui mdui2');

    // 函数返回不同的值
    $('#test div')
      .addClass('item-0 item-1')
      .toggleClass(function(index) {
        return `item-${index}`;
      });
    chai.assert.isFalse($foo.hasClass('item-0'));
    chai.assert.isTrue($foo.hasClass('item-1'));
    chai.assert.isTrue($bar.hasClass('item-0'));
    chai.assert.isFalse($bar.hasClass('item-1'));
  });
});
