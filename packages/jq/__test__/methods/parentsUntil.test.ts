import {
  jQuery,
  jq,
  assert,
  JQStatic,
  toClassNameArray,
  toIdArray,
} from '../utils.js';
import '../../methods/parentsUntil.js';
import '../../methods/parents.js';
import '../../methods/get.js';

const test = ($: JQStatic, type: string): void => {
  describe(`${type} - .parentsUntil`, () => {
    beforeEach(() => {
      document.querySelector('#frame')!.innerHTML = `
<div id="child1" class="child1">
  <div id="child1-1" class="child2">
    <div id="child1-11">
      <div id="child1-1-1" class="child3"></div>
      <div id="child1-1-2" class="child3"></div>
    </div>
  </div>
  <div id="child1-2" class="child2"></div>
</div>
<div id="child2" class="child1">
  <div id="child2-1" class="child2">
    <div id="child2-11">
      <div id="child2-1-1" class="child3"></div>
      <div id="child2-1-2" class="child3"></div>
    </div>
  </div>
  <div id="child2-2" class="child2"></div>
</div>
`;
    });

    it('.parentsUntil(selector, filter)', () => {
      const $child1_1_1 = $('#child1-1-1');
      const $child1_1_2 = $('#child1-1-2');
      const $child2 = $('.child2');
      const $child3 = $('.child3');

      assert.sameOrderedMembers(
        $child1_1_2.parentsUntil().get(),
        $child1_1_2.parents().get(),
      );

      assert.sameOrderedMembers(
        $child3.parentsUntil().get(),
        $child3.parents().get(),
      );

      assert.sameOrderedMembers(
        $child1_1_2.parentsUntil('#notfound').get(),
        $child1_1_2.parents().get(),
      );

      let $parents = $child1_1_1.parentsUntil('#child1');
      assert.sameOrderedMembers(toIdArray($parents), ['child1-11', 'child1-1']);

      $parents = $child3.parentsUntil('.child1');
      assert.sameOrderedMembers(toIdArray($parents), [
        'child2-11',
        'child2-1',
        'child1-11',
        'child1-1',
      ]);

      $parents = $child1_1_1.parentsUntil('#child1', '.child2');
      assert.sameOrderedMembers(toClassNameArray($parents), ['child2']);

      $parents = $child3.parentsUntil('.child1', '.child2');
      assert.sameOrderedMembers(toClassNameArray($parents), [
        'child2',
        'child2',
      ]);

      $parents = $child3.parentsUntil($child2);
      assert.sameOrderedMembers(toIdArray($parents), [
        'child2-11',
        'child1-11',
      ]);

      $parents = $child3.parentsUntil($child2[0]);
      assert.lengthOf($parents, 7);
    });
  });
};

test(jq, 'jq');
test(jQuery as unknown as JQStatic, 'jQuery');
