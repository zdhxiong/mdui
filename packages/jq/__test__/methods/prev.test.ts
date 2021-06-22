import { jQuery, jq, assert, JQStatic, JQ } from '../utils.js';
import '../../methods/prev.js';
import '../../methods/map.js';
import '../../methods/get.js';

const test = ($: JQStatic, type: string): void => {
  describe(`${type} - .prev`, () => {
    beforeEach(() => {
      document.querySelector('#frame')!.innerHTML = `
<p id="test1">a</p>
<div id="test2">b</div>
<p id="test3">c</p>
<div>
  <p>d</p>
  <div id="test4">e</div>
  <p id="test5">f</p>
  <p id="test6">g</p>
</div>
<div class="parent">
  <div id="child1-1" class="child">h</div>
  <div id="child1-2" class="child">i</div>
</div>
<div class="parent">
  <div id="child2-1" class="child">j</div>
  <div id="child2-2" class="child">k</div>
</div>
`;
    });

    it('.prev(selector)', () => {
      const $p = $('#frame p');
      const $test5 = $('#test5');
      const $test6 = $('#test6');
      const $child = $('.child');

      function removeSpace($element: JQ<HTMLElement>): string {
        return $element
          .map((_, element) => element.innerText.trim().replace(/[\r\n]/g, ''))
          .get()
          .join('');
      }

      assert.lengthOf($p.prev(), 3);
      assert.equal(removeSpace($p.prev()), 'bef');

      assert.lengthOf($test6.prev('#test4'), 0);

      assert.lengthOf($test6.prev('#test5'), 1);
      assert.equal(removeSpace($test6.prev('#test5')), 'f');

      assert.lengthOf($test5.prev(), 1);
      assert.equal(removeSpace($test5.prev()), 'e');

      assert.lengthOf($child.prev(), 2);
      assert.equal(removeSpace($child.prev()), 'hj');
    });
  });
};

test(jq, 'jq');
test(jQuery as unknown as JQStatic, 'jQuery');
