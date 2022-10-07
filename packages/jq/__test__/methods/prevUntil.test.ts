import '../../methods/get.js';
import '../../methods/prevUntil.js';
import { jQuery, jq, assert, JQStatic, toIdArray } from '../utils.js';

const test = ($: JQStatic, type: string): void => {
  describe(`${type} - .prevUntil`, () => {
    beforeEach(() => {
      document.querySelector('#frame')!.innerHTML = `
<p id="test1">test1</p>
<p id="test2" class="haha">test2</p>
<p id="test3" class="haha">test3</p>
<p id="test4">test4</p>
<p id="test5">test5</p>
<div class="parent">
  <div id="child1-1" class="child until"></div>
  <div id="child1-2" class="child"></div>
  <div id="child1-3" class="child"></div>
  <div id="child1-4" class="child last"></div>
</div>
<div class="parent">
  <div id="child2-1" class="child"></div>
  <div id="child2-2" class="child last"></div>
</div>
`;
    });

    it('.prevUntil(selector, filter)', () => {
      const $test2 = $('#test2');
      const $test4 = $('#test4');
      const $test5 = $('#test5');
      const $last = $('.last');

      assert.sameOrderedMembers(
        $test4.prevUntil().get(),
        $test4.prevAll().get(),
      );

      assert.sameOrderedMembers(
        $test4.prevUntil('#notfound').get(),
        $test4.prevAll().get(),
      );

      let $prevs = $test5.prevUntil('#test2');
      assert.sameOrderedMembers(toIdArray($prevs), ['test4', 'test3']);

      $prevs = $last.prevUntil('.until');
      assert.sameOrderedMembers(toIdArray($prevs), [
        'child2-1',
        'child1-3',
        'child1-2',
      ]);

      $prevs = $test5.prevUntil('#test1', '.haha');
      assert.sameOrderedMembers(toIdArray($prevs), ['test3', 'test2']);

      $prevs = $last.prevUntil('.until', '#child1-3');
      assert.sameOrderedMembers(toIdArray($prevs), ['child1-3']);

      $prevs = $last.prevUntil('.until', '#notfound');
      assert.lengthOf($prevs, 0);

      $prevs = $test5.prevUntil($test2);
      assert.sameOrderedMembers(toIdArray($prevs), ['test4', 'test3']);

      $prevs = $test5.prevUntil($test2[0]);
      assert.sameOrderedMembers(toIdArray($prevs), ['test4', 'test3']);
    });
  });
};

test(jq, 'jq');
test(jQuery as unknown as JQStatic, 'jQuery');
