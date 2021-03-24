import { assert } from 'chai';
import $ from '../../jq_or_jquery';
import { toIdArray } from '../../utils';

describe('.prevUntil()', function () {
  beforeEach(function () {
    $('#test').html(`
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
    `);
  });

  it('.prevUntil(selector, filter)', function () {
    assert.sameOrderedMembers(
      $('#test4').prevUntil().get(),
      $('#test4').prevAll().get(),
    );

    assert.sameOrderedMembers(
      $('#test4').prevUntil('#notfound').get(),
      $('#test4').prevAll().get(),
    );

    let $prevs = $('#test5').prevUntil('#test2');
    assert.sameOrderedMembers(toIdArray($prevs), ['test4', 'test3']);

    $prevs = $('.last').prevUntil('.until');
    assert.sameOrderedMembers(toIdArray($prevs), [
      'child2-1',
      'child1-3',
      'child1-2',
    ]);

    $prevs = $('#test5').prevUntil('#test1', '.haha');
    assert.sameOrderedMembers(toIdArray($prevs), ['test3', 'test2']);

    $prevs = $('.last').prevUntil('.until', '#child1-3');
    assert.sameOrderedMembers(toIdArray($prevs), ['child1-3']);

    $prevs = $('.last').prevUntil('.until', '#notfound');
    assert.lengthOf($prevs, 0);

    $prevs = $('#test5').prevUntil($('#test2'));
    assert.sameOrderedMembers(toIdArray($prevs), ['test4', 'test3']);

    $prevs = $('#test5').prevUntil($('#test2')[0]);
    assert.sameOrderedMembers(toIdArray($prevs), ['test4', 'test3']);
  });
});
