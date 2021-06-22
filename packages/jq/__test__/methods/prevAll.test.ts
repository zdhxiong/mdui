import { jQuery, jq, assert, JQStatic, toIdArray } from '../utils.js';
import '../../methods/prevAll.js';

const test = ($: JQStatic, type: string): void => {
  describe(`${type} - .prevAll`, () => {
    beforeEach(() => {
      document.querySelector('#frame')!.innerHTML = `
<p id="test1">test1</p>
<div id="test2">test2</div>
<p id="test3">test3</p>
<div>
  <p id="test4">test</p>
  <div id="test5">test5</div>
  <p id="test6">test6</p>
  <p id="test7">test7</p>
</div>
<div class="parent">
  <div id="child1-1" class="child first"></div>
  <div id="child1-2" class="child"></div>
  <div id="child1-3" class="child last"></div>
</div>
<div class="parent">
  <div id="child2-1" class="child first"></div>
  <div id="child2-2" class="child last"></div>
</div>
`;
    });

    it('.prevAll(selector): ', () => {
      const $test6 = $('#test6');
      const $last = $('.last');

      let $prevs = $('#test3').prevAll();
      assert.sameOrderedMembers(toIdArray($prevs), ['test2', 'test1']);

      $prevs = $test6.prevAll();
      assert.sameOrderedMembers(toIdArray($prevs), ['test5', 'test4']);

      $prevs = $test6.prevAll('#test4');
      assert.sameOrderedMembers(toIdArray($prevs), ['test4']);

      $prevs = $last.prevAll();
      assert.sameOrderedMembers(toIdArray($prevs), [
        'child2-1',
        'child1-2',
        'child1-1',
      ]);

      $prevs = $last.prevAll('.first');
      assert.sameOrderedMembers(toIdArray($prevs), ['child2-1', 'child1-1']);
    });
  });
};

test(jq, 'jq');
test(jQuery as unknown as JQStatic, 'jQuery');
