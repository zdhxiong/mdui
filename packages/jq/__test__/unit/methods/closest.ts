import { assert } from 'chai';
import $ from '../../jq_or_jquery';
import { toIdArray } from '../../utils';

describe('.closest()', function () {
  beforeEach(function () {
    $('#test').html(`
<div id="child1" class="child">
  <div id="child2" class="child">
    <div id="child3">
      <div id="child4"></div>
    </div>
  </div>
</div>
    `);
  });

  it('.closest(selector)', function () {
    // $().closest(selector)
    let $dom = $('#child4').closest('.child');
    assert.sameOrderedMembers(toIdArray($dom), ['child2']);

    // $().closest(selector) 当前元素已匹配
    $dom = $('#child4').closest('#child4');
    assert.sameOrderedMembers(toIdArray($dom), ['child4']);
  });
});
