import '../../static/unique.js';
import { jQuery, jq, assert, JQStatic, selectorToArray } from '../utils.js';

const test = ($: JQStatic, type: string): void => {
  describe(`${type} - $.unique`, () => {
    before(() => {
      document.querySelector('#frame')!.innerHTML = `
<div>There are 6 divs in this document.</div>
<div></div>
<div class="dup"></div>
<div class="dup"></div>
<div class="dup"></div>
<div></div>
`;
    });

    // 过滤数组中的重复 DOM
    it('$.unique()', () => {
      const divs = selectorToArray('#frame div');
      const concatedDivs = divs.concat(selectorToArray('#frame .dup'));
      assert.sameOrderedMembers(divs, $.unique(concatedDivs));
    });

    // 过滤数组中的重复元素（jQuery 不支持非 DOM 元素组成的数组）
    it('$.unique(array1, array2)', () => {
      if (type === 'jq') {
        assert.sameOrderedMembers(
          $.unique([1, 2, 12, 3, 2, 1, 2, 1, 1, 1, 1]),
          [1, 2, 12, 3],
        );
      }
    });
  });
};

test(jq, 'jq');
test(jQuery as unknown as JQStatic, 'jQuery');
