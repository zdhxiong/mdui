import { assert } from 'chai';
import $ from '../../jq_or_jquery';

describe('.siblings()', function () {
  beforeEach(function () {
    $('#test').html(`
<div id="child1" class="child1">
  <div id="child1-1" class="child2">
    <div id="child1-1-1" class="child3"></div>
    <div id="child1-1-2" class="child3"></div>
  </div>
  <div id="child1-2" class="child2"></div>
  <div id="child1-3" class="child2"></div>
</div>
    `);
  });

  it('.siblings()', function () {
    assert.sameMembers(
      $('#child1-2').siblings().get(),
      $('#child1-1, #child1-3').get(),
    );

    assert.sameMembers(
      $('#child1-1, #child1-3').siblings().get(),
      $('.child2').get(),
    );
  });

  it('.siblings(selector)', function () {
    assert.sameMembers(
      $('#child1-2').siblings('#child1-3').get(),
      $('#child1-3').get(),
    );
  });
});
