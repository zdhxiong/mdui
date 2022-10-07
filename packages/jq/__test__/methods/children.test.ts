import '../../methods/children.js';
import { jQuery, jq, assert, JQStatic, toIdArray } from '../utils.js';

const test = ($: JQStatic, type: string): void => {
  describe(`${type} - .children`, () => {
    beforeEach(() => {
      document.querySelector('#frame')!.innerHTML = `
<div id="child">
  <div id="child1"></div>
  <div id="child2" class="child">
    <div id="child2-1"></div>
    <div id="child2-2"></div>
  </div>
  <div id="child3" class="child"></div>
</div>
`;
    });

    it('.children()', () => {
      const $children = $('#child').children();
      assert.sameOrderedMembers(toIdArray($children), [
        'child1',
        'child2',
        'child3',
      ]);
    });

    it('.children(selector)', () => {
      const $child = $('#child');
      let $children = $child.children('.child');
      assert.sameOrderedMembers(toIdArray($children), ['child2', 'child3']);

      $children = $child.children('#child2-1');
      assert.lengthOf($children, 0);
    });
  });
};

test(jq, 'jq');
test(jQuery as unknown as JQStatic, 'jQuery');
