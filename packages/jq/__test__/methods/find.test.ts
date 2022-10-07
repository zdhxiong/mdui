import '../../methods/find.js';
import { jQuery, jq, assert, JQStatic, toIdArray } from '../utils.js';

const test = ($: JQStatic, type: string): void => {
  describe(`${type} - .find`, () => {
    beforeEach(() => {
      document.querySelector('#frame')!.innerHTML = `
<div id="child">
  <div class="child" id="child-1"></div>
  <div class="child" id="child-2">
    <div class="child2" id="child-2-1"></div>
    <div class="child2" id="child-2-2"></div>
  </div>
</div>
`;
    });

    it('.find(selector)', () => {
      const $child = $('#child');
      let $children = $child.find('.child');
      assert.sameOrderedMembers(toIdArray($children), ['child-1', 'child-2']);

      $children = $child.find('.child2');
      assert.sameOrderedMembers(toIdArray($children), [
        'child-2-1',
        'child-2-2',
      ]);

      $children = $child.find('#child-2-1');
      assert.sameOrderedMembers(toIdArray($children), ['child-2-1']);

      $children = $child.find('div');
      assert.sameOrderedMembers(toIdArray($children), [
        'child-1',
        'child-2',
        'child-2-1',
        'child-2-2',
      ]);

      const $children2 = $(document).find('.child');
      // @ts-ignore
      assert.sameOrderedMembers(toIdArray($children2), ['child-1', 'child-2']);
    });
  });
};

test(jq, 'jq');
test(jQuery as unknown as JQStatic, 'jQuery');
