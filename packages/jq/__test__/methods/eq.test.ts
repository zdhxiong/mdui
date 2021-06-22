import { jQuery, jq, assert, JQStatic } from '../utils.js';
import '../../methods/eq.js';
import '../../methods/is.js';

const test = ($: JQStatic, type: string): void => {
  describe(`${type} - .eq`, () => {
    beforeEach(() => {
      document.querySelector('#frame')!.innerHTML = `
<div id="child1" class="child">a</div>
<div id="child2" class="child">b</div>
<div id="child3" class="child">c</div>
<div id="child4" class="child">d</div>
`;
    });

    it('.eq(index: number): JQ', () => {
      const $children = $('#frame .child');

      assert.isTrue($children.eq(0).is('#child1'));
      assert.isTrue($children.eq(1).is('#child2'));
      assert.isTrue($children.eq(2).is('#child3'));
      assert.isTrue($children.eq(3).is('#child4'));
      assert.lengthOf($children.eq(4), 0);
      assert.isTrue($children.eq(-1).is('#child4'));
      assert.isTrue($children.eq(-3).is('#child2'));
      assert.lengthOf($children.eq(-5), 0);
    });
  });
};

test(jq, 'jq');
test(jQuery as unknown as JQStatic, 'jQuery');
