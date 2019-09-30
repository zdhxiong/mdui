import $ from '../../jq_or_jquery';
import { toIdArray } from '../../utils';

describe('.children()', function() {
  beforeEach(function() {
    $('#test').html(`
<div id="child">
  <div id="child1"></div>
  <div id="child2" class="child">
    <div id="child2-1"></div>
    <div id="child2-2"></div>
  </div>
  <div id="child3" class="child"></div>
</div>
`);
  });

  it('.children()', function() {
    const $children = $('#child').children();
    chai.assert.sameOrderedMembers(toIdArray($children), [
      'child1',
      'child2',
      'child3',
    ]);
  });

  it('.children(selector)', function() {
    let $children = $('#child').children('.child');
    chai.assert.sameOrderedMembers(toIdArray($children), ['child2', 'child3']);

    $children = $('#child').children('#child2-1');
    chai.assert.lengthOf($children, 0);
  });
});
