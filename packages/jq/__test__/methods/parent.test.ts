import {
  jQuery,
  jq,
  assert,
  JQStatic,
  toIdArray,
  toTagNameArray,
} from '../utils.js';
import '../../methods/parent.js';

const test = ($: JQStatic, type: string): void => {
  describe(`${type} - .parent`, () => {
    beforeEach(() => {
      document.querySelector('#frame')!.innerHTML = `
<div id="child1" class="child1">
  <div id="child1-1" class="child2">
    <div id="child1-1-1" class="child3"></div>
    <div id="child1-1-2" class="child3"></div>
  </div>
  <div id="child1-2" class="child2"></div>
</div>
<div id="child2" class="child1">
  <div id="child2-1" class="child2">
    <div id="child2-1-1" class="child3"></div>
    <div id="child2-1-2" class="child3"></div>
  </div>
  <div id="child2-2" class="child2"></div>
</div>
`;
    });

    it('.parent(selector)', () => {
      const $child3 = $('.child3');

      let $parent = $('#child1-1-1').parent();
      assert.sameOrderedMembers(toIdArray($parent), ['child1-1']);

      $parent = $child3.parent();
      assert.sameOrderedMembers(toIdArray($parent), ['child1-1', 'child2-1']);

      $parent = $(document.body).parent();
      assert.sameOrderedMembers(toTagNameArray($parent), ['html']);

      $parent = $child3.parent('#child2-1');
      assert.sameOrderedMembers(toIdArray($parent), ['child2-1']);

      $parent = $child3.parent('#frame');
      assert.lengthOf($parent, 0);
    });
  });
};

test(jq, 'jq');
test(jQuery as unknown as JQStatic, 'jQuery');
