import { assert } from 'chai';
import $ from '../../jq_or_jquery';

describe('.offsetParent()', function () {
  beforeEach(function () {
    $('#test').html(`
<ul class="level-1">
  <li class="item-ii" style="position: relative;">II
    <ul class="level-2">
      <li class="item-a">A</li>
    </ul>
  </li>
  <li class="item-ii" style="position: relative;">II
    <ul class="level-2">
      <li class="item-a">A</li>
    </ul>
  </li>
</ul>
    `);
  });

  it('.offsetParent()', function () {
    assert.sameOrderedMembers(
      $('.item-a').offsetParent().get(),
      $('.item-ii').get(),
    );
  });
});
