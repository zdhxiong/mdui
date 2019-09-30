import $ from '../../jq_or_jquery';
import { toIdArray, toClassNameArray } from '../../utils';

describe('.parentsUntil()', function() {
  beforeEach(function() {
    $('#test').html(`
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
    `);
  });

  it('.parentsUntil(selector, filter)', function() {
    chai.assert.sameOrderedMembers(
      $('#child1-1-2')
        .parentsUntil()
        .get(),
      $('#child1-1-2')
        .parents()
        .get(),
    );

    chai.assert.sameOrderedMembers(
      $('.child3')
        .parentsUntil()
        .get(),
      $('.child3')
        .parents()
        .get(),
    );

    chai.assert.sameOrderedMembers(
      $('#child1-1-2')
        .parentsUntil('#notfound')
        .get(),
      $('#child1-1-2')
        .parents()
        .get(),
    );

    let $parents = $('#child1-1-1').parentsUntil('#child1');
    chai.assert.sameOrderedMembers(toIdArray($parents), [
      'child1-11',
      'child1-1',
    ]);

    $parents = $('.child3').parentsUntil('.child1');
    chai.assert.sameOrderedMembers(toIdArray($parents), [
      'child2-11',
      'child2-1',
      'child1-11',
      'child1-1',
    ]);

    $parents = $('#child1-1-1').parentsUntil('#child1', '.child2');
    chai.assert.sameOrderedMembers(toClassNameArray($parents), ['child2']);

    $parents = $('.child3').parentsUntil('.child1', '.child2');
    chai.assert.sameOrderedMembers(toClassNameArray($parents), [
      'child2',
      'child2',
    ]);

    $parents = $('.child3').parentsUntil($('.child2'));
    chai.assert.sameOrderedMembers(toIdArray($parents), [
      'child2-11',
      'child1-11',
    ]);

    $parents = $('.child3').parentsUntil($('.child2')[0]);
    chai.assert.lengthOf($parents, 7);
  });
});
