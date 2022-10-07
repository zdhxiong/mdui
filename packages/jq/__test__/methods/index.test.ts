import '../../methods/index.js';
import { jQuery, jq, assert, JQStatic } from '../utils.js';

const test = ($: JQStatic, type: string): void => {
  describe(`${type} - .index`, () => {
    beforeEach(() => {
      document.querySelector('#frame')!.innerHTML = `
<div id="a">a</div>
<div id="b">b</div>
<div id="c" class="haha">c</div>
<div id="d" class="haha">d</div>
<div id="e">e</div>
`;
    });

    it('.index()', () => {
      assert.deepEqual($('#c').index(), 2);
      assert.deepEqual($('#notfound').index(), -1);
    });

    it('.index(selector)', () => {
      const $divs = $('#frame div');
      const $c = $('#c');

      assert.deepEqual($divs.index($c[0]), 2);
      assert.deepEqual($divs.index($c), 2);
      assert.deepEqual($divs.index($('.haha')), 2); // JQ 对象中有多个元素时，匹配第一个元素
      assert.deepEqual($divs.index('#c'), -1);
      assert.deepEqual($('#d').index('.haha'), 1);
      assert.deepEqual($divs.index('#notfound'), -1);
      assert.deepEqual($divs.index('.haha'), -1);
    });
  });
};

test(jq, 'jq');
test(jQuery as unknown as JQStatic, 'jQuery');
