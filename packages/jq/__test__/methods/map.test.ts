import '../../methods/get.js';
import '../../methods/map.js';
import '../../methods/text.js';
import { jQuery, jq, assert, JQStatic } from '../utils.js';

const test = ($: JQStatic, type: string): void => {
  describe(`${type} - .map`, () => {
    beforeEach(() => {
      document.querySelector('#frame')!.innerHTML = `
<div>a</div>
<div>b</div>
<div>c</div>
<div>d</div>
`;
    });

    it('.map(callback)', () => {
      const $divs = $('#frame div');

      const _thiss: HTMLElement[] = [];
      const _indexs: number[] = [];
      const _elements: HTMLElement[] = [];

      const ret = $divs.map(function (i, element) {
        _thiss.push(this);
        _indexs.push(i);
        _elements.push(element);

        // null 和 undefined 会被过滤
        if (i === 1) return null;
        if (i === 2) return undefined;

        return element;
      });

      assert.sameOrderedMembers(_thiss, $divs.get());
      assert.sameOrderedMembers(_indexs, [0, 1, 2, 3]);
      assert.sameOrderedMembers(_elements, $divs.get());
      assert.lengthOf(ret, 2);
      assert.equal(ret.text(), 'ad');

      // 返回 index
      const ret2 = $divs
        .map((index) => {
          return [index, index + 1];
        })
        .get()
        .join(',');
      assert.equal(ret2, '0,1,1,2,2,3,3,4');
    });
  });
};

test(jq, 'jq');
test(jQuery as unknown as JQStatic, 'jQuery');
