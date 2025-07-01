import '../../methods/addClass.js';
import '../../methods/attr.js';
import '../../methods/hasClass.js';
import '../../methods/toggleClass.js';
import { jQuery, jq, assert, JQStatic } from '../utils.js';

const test = ($: JQStatic, type: string): void => {
  describe(`${type} - .toggleClass`, () => {
    beforeEach(() => {
      document.querySelector('#frame')!.innerHTML = `
<div id="foo" class="mdui">Hello</div>
<div id="bar">World</div>
`;
    });

    it('.toggleClass(name)', () => {
      const $foo = $('#foo');
      assert.equal($foo.attr('class'), 'mdui');

      // 切换空类
      $foo.toggleClass('');
      assert.equal($foo.attr('class'), 'mdui');

      // 切换一个类
      // 返回 JQ
      const $result = $foo.toggleClass('box1');
      assert.deepEqual($result, $foo);
      assert.equal($foo.attr('class'), 'mdui box1');

      // 切换多个类，用空格分隔
      $foo.toggleClass('box1 box2');
      assert.equal($foo.attr('class'), 'mdui box2');
    });

    it('.toggleClass(callback)', () => {
      const $foo = $('#foo');
      const $bar = $('#bar');

      // 函数的 this 指向，参数验证
      let _this;
      let _i;
      let _currentClassName;
      $foo.toggleClass(function (i, currentClassName) {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        _this = this;
        _i = i;
        _currentClassName = currentClassName;

        return '';
      });

      assert.deepEqual(_this, $foo[0]);
      assert.equal(_i, 0);
      assert.equal(_currentClassName, 'mdui');

      // 通过函数返回类
      $foo.toggleClass(() => {
        return 'mdui1';
      });
      assert.equal($foo.attr('class'), 'mdui mdui1');

      // 通过函数返回多个类
      $foo.toggleClass(() => {
        return 'mdui1  mdui2';
      });
      assert.equal($foo.attr('class'), 'mdui mdui2');

      // 函数返回不同的值
      $('#frame div')
        .addClass('item-0 item-1')
        .toggleClass((index) => {
          return `item-${index}`;
        });
      assert.isFalse($foo.hasClass('item-0'));
      assert.isTrue($foo.hasClass('item-1'));
      assert.isTrue($bar.hasClass('item-0'));
      assert.isFalse($bar.hasClass('item-1'));
    });
  });
};

test(jq, 'jq');
test(jQuery as unknown as JQStatic, 'jQuery');
