import { assert } from 'chai';
import $ from '../../jq_or_jquery';

describe('$.unique', function () {
  beforeEach(function () {
    $('#test').html(`
<div>There are 6 divs in this document.</div>
<div></div>
<div class="dup"></div>
<div class="dup"></div>
<div class="dup"></div>
<div></div>
    `);
  });

  it('$.unique(array1, array2)', function () {
    // 过滤数组中的重复 DOM
    const divs = $('#test div').get();
    const concatedDivs = divs.concat($('#test .dup').get());
    assert.sameOrderedMembers(divs, $.unique(concatedDivs));

    // 过滤数组中的重复元素（jQuery 不支持非 DOM 元素组成的数组）
    // @ts-ignore
    if (typeof jQuery === 'undefined') {
      assert.sameOrderedMembers($.unique([1, 2, 12, 3, 2, 1, 2, 1, 1, 1, 1]), [
        1,
        2,
        12,
        3,
      ]);
    }
  });
});
