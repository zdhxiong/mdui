import { jQuery, jq, assert, JQStatic, toIdArray } from '../utils.js';
import '../../methods/nextUntil.js';
import '../../methods/nextAll.js';
import '../../methods/get.js';

const test = ($: JQStatic, type: string): void => {
  describe(`${type} - .nextUntil`, () => {
    beforeEach(() => {
      document.querySelector('#frame')!.innerHTML = `
<p id="test1">test1</p>
<p id="test2" class="haha">test2</p>
<p id="test3" class="haha">test3</p>
<p id="test4">test4</p>
<p id="test5">test5</p>
<div class="parent">
  <div id="child1-1" class="child first"></div>
  <div id="child1-2" class="child"></div>
  <div id="child1-3" class="child"></div>
  <div id="child1-4" class="child last"></div>
</div>
<div class="parent">
  <div id="child2-1" class="child first"></div>
  <div id="child2-2" class="child last"></div>
</div>
`;
    });

    it('.nextUntil(selector, filter)', () => {
      const $test2 = $('#test2');
      const $test1 = $('#test1');
      const $test4 = $('#test4');
      const $first = $('.first');

      assert.sameOrderedMembers(
        $test2.nextUntil().get(),
        $test2.nextAll().get(),
      );

      assert.sameOrderedMembers(
        $test2.nextUntil('#notfound').get(),
        $test2.nextAll().get(),
      );

      let $nexts = $test1.nextUntil('#test4');
      assert.sameOrderedMembers(toIdArray($nexts), ['test2', 'test3']);

      $nexts = $first.nextUntil('#child1-4');
      assert.sameOrderedMembers(toIdArray($nexts), [
        'child1-2',
        'child1-3',
        'child2-2',
      ]);

      $nexts = $test1.nextUntil('.parent', '.haha');
      assert.sameOrderedMembers(toIdArray($nexts), ['test2', 'test3']);

      $nexts = $first.nextUntil('.last', '#child1-3');
      assert.sameOrderedMembers(toIdArray($nexts), ['child1-3']);

      $nexts = $first.nextUntil('.last', '#notfound');
      assert.lengthOf($nexts, 0);

      $nexts = $test1.nextUntil($test4);
      assert.sameOrderedMembers(toIdArray($nexts), ['test2', 'test3']);

      $nexts = $test1.nextUntil($test4[0]);
      assert.sameOrderedMembers(toIdArray($nexts), ['test2', 'test3']);
    });
  });
};

test(jq, 'jq');
test(jQuery as unknown as JQStatic, 'jQuery');
