import { jQuery, jq, assert, JQStatic } from '../utils.js';
import '../../methods/has.js';
import '../../methods/eq.js';
import '../../methods/is.js';

const test = ($: JQStatic, type: string): void => {
  describe(`${type} - .has`, () => {
    beforeEach(() => {
      document.querySelector('#frame')!.innerHTML = `
<div class="child" id="child1"></div>
<div class="child" id="child2">
  <div class="child2" id="child2-1"></div>
  <div class="child2" id="child2-2"></div>
</div>
<div class="child" id="child3"></div>
`;
    });

    it('.has(selector)', () => {
      const $child = $('.child');
      const $children = $child.has('#child2-1');
      assert.lengthOf($children, 1);
      assert.isTrue($children.eq(0).is('#child2'));

      assert.lengthOf($child.has('.notfound'), 0);
    });

    it('.has(dom)', () => {
      const child = document.getElementById('child2-1') as HTMLElement;
      const $children = $('.child').has(child);
      assert.lengthOf($children, 1);
      assert.isTrue($children.eq(0).is('#child2'));
    });
  });
};

test(jq, 'jq');
test(jQuery as unknown as JQStatic, 'jQuery');
