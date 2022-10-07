import '../../methods/filter.js';
import '../../methods/get.js';
import '../../methods/text.js';
import { jQuery, jq, assert, JQStatic } from '../utils.js';

const test = ($: JQStatic, type: string): void => {
  describe(`${type} - .filter`, () => {
    beforeEach(() => {
      document.querySelector('#frame')!.innerHTML = `
<div>a</div>
<div class="haha">b</div>
<div class="haha">c</div>
<div>d</div>
<div>e</div>
`;
    });

    it('.filter(selector)', () => {
      const $divs = $('#frame div');
      const $haha = $('.haha');

      // $().filter('.haha')
      assert.equal($divs.filter('.haha').text(), 'bc');

      // $().filter(element)
      assert.equal($divs.filter($haha[0]).text(), 'b');

      // $().filter(elements)
      assert.equal($divs.filter($haha.get()).text(), 'bc');

      // $().filter($('.haha'))
      assert.equal($divs.filter($haha).text(), 'bc');

      // 动态生成的元素
      assert.equal(
        $('<div id="d1">d1</div><div id="d2">d2</div>').filter('#d2').text(),
        'd2',
      );
    });

    it('.filter(callback)', function () {
      const $divs = $('#frame div');

      // 测试函数参数和 this 指向
      const _thiss: HTMLElement[] = [];
      const _indexs: number[] = [];
      const _elements: HTMLElement[] = [];
      $divs.filter(function (index, element) {
        _thiss.push(this);
        _indexs.push(index);
        _elements.push(element);

        return false;
      });
      assert.sameOrderedMembers(_thiss, $divs.get());
      assert.sameOrderedMembers(_indexs, [0, 1, 2, 3, 4]);
      assert.sameOrderedMembers(_elements, $divs.get());

      // $().filter(function (index) {})
      let $ret = $divs.filter((index) => {
        return index === 0 || index === 3;
      });
      assert.equal($ret.text(), 'ad');

      // $().filter(function (index, element) {})
      $ret = $divs.filter(function (index, element) {
        if (index === 0) return false;
        if (this.innerHTML === 'c') return true; // this 指向 element

        return element.innerHTML === 'd';
      });
      assert.equal($ret.text(), 'cd');

      // 动态生成的元素
      assert.equal(
        $('<div id="d1">d1</div><div id="d2">d2</div>')
          .filter((index) => index === 1)
          .text(),
        'd2',
      );
    });
  });
};

test(jq, 'jq');
test(jQuery as unknown as JQStatic, 'jQuery');
