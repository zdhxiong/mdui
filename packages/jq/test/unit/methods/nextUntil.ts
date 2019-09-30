import $ from '../../jq_or_jquery';
import { toIdArray } from '../../utils';

describe('.nextUntil()', function() {
  beforeEach(function() {
    $('#test').html(`
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
    `);
  });

  it('.nextUntil(selector, filter)', function() {
    chai.assert.sameOrderedMembers(
      $('#test2')
        .nextUntil()
        .get(),
      $('#test2')
        .nextAll()
        .get(),
    );

    chai.assert.sameOrderedMembers(
      $('#test2')
        .nextUntil('#notfound')
        .get(),
      $('#test2')
        .nextAll()
        .get(),
    );

    let $nexts = $('#test1').nextUntil('#test4');
    chai.assert.sameOrderedMembers(toIdArray($nexts), ['test2', 'test3']);

    $nexts = $('.first').nextUntil('#child1-4');
    chai.assert.sameOrderedMembers(toIdArray($nexts), [
      'child1-2',
      'child1-3',
      'child2-2',
    ]);

    $nexts = $('#test1').nextUntil('.parent', '.haha');
    chai.assert.sameOrderedMembers(toIdArray($nexts), ['test2', 'test3']);

    $nexts = $('.first').nextUntil('.last', '#child1-3');
    chai.assert.sameOrderedMembers(toIdArray($nexts), ['child1-3']);

    $nexts = $('.first').nextUntil('.last', '#notfound');
    chai.assert.lengthOf($nexts, 0);

    $nexts = $('#test1').nextUntil($('#test4'));
    chai.assert.sameOrderedMembers(toIdArray($nexts), ['test2', 'test3']);

    $nexts = $('#test1').nextUntil($('#test4')[0]);
    chai.assert.sameOrderedMembers(toIdArray($nexts), ['test2', 'test3']);
  });
});
