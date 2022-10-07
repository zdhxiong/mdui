import '../../methods/get.js';
import '../../methods/map.js';
import '../../methods/next.js';
import { jQuery, jq, assert, JQStatic, JQ } from '../utils.js';

const test = ($: JQStatic, type: string): void => {
  describe(`${type} - .next`, () => {
    beforeEach(() => {
      document.querySelector('#frame')!.innerHTML = `
<p id="test1">a</p>
<div id="test2">b</div>
<p id="test3">c</p>
<div id="wrap">
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

    it('.next(selector)', () => {
      function removeSpace($element: JQ<HTMLElement>): string {
        return $element
          .map((_, element) => element.innerText.trim().replace(/[\r\n]/g, ''))
          .get()
          .join('');
      }

      const $p = $('#frame p');
      const $test4 = $('#test4');
      const $child = $('.child');

      assert.lengthOf($p.next(), 4);
      assert.equal(removeSpace($p.next()), 'bdefgeg');

      assert.lengthOf($test4.next('#test6'), 0);

      assert.lengthOf($test4.next('#test5'), 1);
      assert.equal(removeSpace($test4.next('#test5')), 'f');

      assert.lengthOf($test4.next(), 1);
      assert.equal(removeSpace($test4.next()), 'f');

      assert.lengthOf($child.next(), 2);
      assert.equal(removeSpace($child.next()), 'ik');
    });
  });
};

test(jq, 'jq');
test(jQuery as unknown as JQStatic, 'jQuery');
