import '../../methods/closest.js';
import { jQuery, jq, assert, JQStatic, toIdArray } from '../utils.js';

const test = ($: JQStatic, type: string): void => {
  describe(`${type} - .closest`, () => {
    beforeEach(() => {
      document.querySelector('#frame')!.innerHTML = `
<div id="child1" class="child">
  <div id="child2" class="child">
    <div id="child3">
      <div id="child4"></div>
    </div>
  </div>
</div>
`;
    });

    it('.closest(selector)', () => {
      const $child4 = $('#child4');

      // $().closest(selector)
      let $dom = $child4.closest('.child');
      assert.sameOrderedMembers(toIdArray($dom), ['child2']);

      // $().closest(selector) 当前元素已匹配
      $dom = $child4.closest('#child4');
      assert.sameOrderedMembers(toIdArray($dom), ['child4']);
    });
  });
};

test(jq, 'jq');
test(jQuery as unknown as JQStatic, 'jQuery');
