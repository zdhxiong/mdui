import '../../methods/addClass.js';
import { jQuery, jq, assert, JQStatic } from '../utils.js';

const test = ($: JQStatic, type: string): void => {
  describe(`${type} - .addClass`, () => {
    beforeEach(() => {
      document.querySelector('#frame')!.innerHTML = `
<div id="foo">Hello</div>
<div id="bar">World</div>
`;
    });

    it('.addClass(name)', () => {
      const $foo = $('#foo');
      assert.isNull($foo[0].getAttribute('class'));

      // 添加空字符
      $foo.addClass('');
      assert.isNull($foo[0].getAttribute('class'));

      // 添加一个类
      // 返回 JQ
      const $result = $foo.addClass('mdui');
      assert.deepEqual($result, $foo);
      assert.equal($foo[0].getAttribute('class'), 'mdui');

      // 添加多个类，用空格分隔
      $foo.addClass('mdui1  mdui2');
      assert.equal($foo[0].getAttribute('class'), 'mdui mdui1 mdui2');
    });

    it('.addClass(callback)', () => {
      const $foo = $('#foo');
      const $bar = $('#bar');

      // 函数的 this 指向，参数验证
      let _this;
      let _i;
      let _currentClassName;
      $foo.addClass('mdui1 mdui2');
      $foo.addClass(function (i, currentClassName) {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        _this = this;
        _i = i;
        _currentClassName = currentClassName;

        return '';
      });

      assert.deepEqual(_this, $foo[0]);
      assert.equal(_i, 0);
      assert.equal(_currentClassName, 'mdui1 mdui2');

      // 通过函数返回类
      $foo.addClass(() => {
        return 'mdui3';
      });
      assert.equal($foo[0].getAttribute('class'), 'mdui1 mdui2 mdui3');

      // 通过函数返回多个类
      $foo.addClass(() => {
        return 'mdui4 mdui5  mdui6';
      });
      assert.equal(
        $foo[0].getAttribute('class'),
        'mdui1 mdui2 mdui3 mdui4 mdui5 mdui6',
      );

      // 函数返回不同的值
      $('#frame div').addClass((index) => {
        return `item-${index}`;
      });
      assert.isTrue($foo[0].classList.contains('item-0'));
      assert.isFalse($foo[0].classList.contains('item-1'));
      assert.isFalse($bar[0].classList.contains('item-0'));
      assert.isTrue($bar[0].classList.contains('item-1'));
    });
  });
};

test(jq, 'jq');
test(jQuery as unknown as JQStatic, 'jQuery');
