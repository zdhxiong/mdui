import '../../methods/get.js';
import '../../methods/not.js';
import '../../methods/text.js';
import { jQuery, jq, assert, JQStatic } from '../utils.js';

const test = ($: JQStatic, type: string): void => {
  describe(`${type} - .not`, () => {
    beforeEach(() => {
      document.querySelector('#frame')!.innerHTML = `
<div>a</div>
<div class="haha">b</div>
<div class="haha">c</div>
<div>d</div>
<div>e</div>
`;
    });

    it('.not(selector)', () => {
      const $divs = $('#frame div');
      const $haha = $('.haha');

      // $().not('.haha')
      assert.equal($divs.not('.haha').text(), 'ade');

      // $().not(element)
      assert.equal($divs.not($haha[0]).text(), 'acde');

      // $().not(elements)
      assert.equal($divs.not($haha.get()).text(), 'ade');

      // $().not($('.haha'))
      assert.equal($divs.not($haha).text(), 'ade');

      // 动态生成的元素
      assert.equal(
        $('<div id="d1">d1</div><div id="d2">d2</div>').not('#d2').text(),
        'd1',
      );
    });

    it('.not(callback)', () => {
      const $divs = $('#frame div');

      // 测试函数参数和 this 指向
      const _thiss: HTMLElement[] = [];
      const _indexs: number[] = [];
      const _elements: HTMLElement[] = [];
      $divs.not(function (index, element) {
        _thiss.push(this);
        _indexs.push(index);
        _elements.push(element);

        return false;
      });
      assert.sameOrderedMembers(_thiss, $divs.get());
      assert.sameOrderedMembers(_indexs, [0, 1, 2, 3, 4]);
      assert.sameOrderedMembers(_elements, $divs.get());

      // $().not(function (index) {})
      let $ret = $divs.not((index) => {
        return index === 0 || index === 3;
      });
      assert.equal($ret.text(), 'bce');

      // $().not(function (index, element) {})
      $ret = $divs.not(function (index, element) {
        if (index === 0) return false;
        if (this.innerHTML === 'c') return true; // this 指向 element

        return element.innerHTML === 'd';
      });
      assert.equal($ret.text(), 'abe');

      // 动态生成的元素
      assert.equal(
        $('<div id="d1">d1</div><div id="d2">d2</div>')
          .not((index) => index === 1)
          .text(),
        'd1',
      );
    });
  });
};

test(jq, 'jq');
test(jQuery as unknown as JQStatic, 'jQuery');
