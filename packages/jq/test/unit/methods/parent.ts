import $ from '../../jq_or_jquery';
import { toIdArray, toTagNameArray } from '../../utils';

describe('.parent()', function() {
  beforeEach(function() {
    $('#test').html(`
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
    `);
  });

  it('.parent(selector)', function() {
    let $parent = $('#child1-1-1').parent();
    chai.assert.sameOrderedMembers(toIdArray($parent), ['child1-1']);

    $parent = $('.child3').parent();
    chai.assert.sameOrderedMembers(toIdArray($parent), [
      'child1-1',
      'child2-1',
    ]);

    $parent = $(document.body).parent();
    chai.assert.sameOrderedMembers(toTagNameArray($parent), ['html']);

    $parent = $('.child3').parent('#child2-1');
    chai.assert.sameOrderedMembers(toIdArray($parent), ['child2-1']);

    $parent = $('.child3').parent('#test');
    chai.assert.lengthOf($parent, 0);
  });
});
