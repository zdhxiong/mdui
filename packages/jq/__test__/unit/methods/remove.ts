import { assert } from 'chai';
import $ from '../../jq_or_jquery';

describe('.remove()', function () {
  beforeEach(function () {
    $('#test').html(`
<div class="child">
  <div class="child2" id="child2-1">
    <div class="child3">first</div>
  </div>
  <div class="child2" id="child2-2">
    <div class="child3">second</div>
  </div>
</div>
    `);
  });

  it('.remove()', function () {
    const $result = $('#child2-1').remove();
    assert.isTrue($result.is('#child2-1'));
    assert.lengthOf($('#child2-1'), 0);
    assert.lengthOf($('.child2'), 1);
    assert.lengthOf($('#child2-2'), 1);

    // 未匹配的元素上执行 remove()
    assert.lengthOf($('#hgufdg').remove(), 0);
  });

  it('.remove(selector)', function () {
    const $result = $('.child2').remove('#child2-1');
    assert.lengthOf($result, 2);
    assert.isTrue($result.eq(0).is('#child2-1'));
    assert.isTrue($result.eq(1).is('#child2-2'));
    assert.lengthOf($('#child2-1'), 0);
    assert.lengthOf($('#child2-2'), 1);
  });
});
