import { assert } from 'chai';
import $ from '../../jq_or_jquery';

describe('.get()', function () {
  this.beforeEach(function () {
    $('#test').html(`
<div>a</div>
<div>b</div>
<div>c</div>
<div>d</div>
    `);
  });

  it('.get(index)', function () {
    const $divs = $('#test div');

    assert.equal($divs.get(1).innerHTML, 'b');
    assert.isUndefined($divs.get(4));
    assert.equal($divs.get(-1).innerHTML, 'd');
  });

  it('.get()', function () {
    const ret = $('#test div').get();
    assert.isArray(ret);
    assert.lengthOf(ret, 4);
    assert.equal(ret[2].innerHTML, 'c');
  });
});
