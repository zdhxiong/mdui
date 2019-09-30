import $ from '../../jq_or_jquery';
import { toIdArray } from '../../utils';

describe('.find()', function() {
  beforeEach(function() {
    $('#test').html(`
<div id="child">
  <div class="child" id="child-1"></div>
  <div class="child" id="child-2">
    <div class="child2" id="child-2-1"></div>
    <div class="child2" id="child-2-2"></div>
  </div>
</div>
    `);
  });

  it('.find(selector)', function() {
    let $children = $('#child').find('.child');
    chai.assert.sameOrderedMembers(toIdArray($children), [
      'child-1',
      'child-2',
    ]);

    $children = $('#child').find('.child2');
    chai.assert.sameOrderedMembers(toIdArray($children), [
      'child-2-1',
      'child-2-2',
    ]);

    $children = $('#child').find('#child-2-1');
    chai.assert.sameOrderedMembers(toIdArray($children), ['child-2-1']);

    $children = $('#child').find('div');
    chai.assert.sameOrderedMembers(toIdArray($children), [
      'child-1',
      'child-2',
      'child-2-1',
      'child-2-2',
    ]);

    const $children2 = $(document).find('.child');
    // @ts-ignore
    chai.assert.sameOrderedMembers(toIdArray($children2), [
      'child-1',
      'child-2',
    ]);
  });
});
