import { assert } from 'chai';
import $ from '../../jq_or_jquery';

describe('.clone()', function () {
  beforeEach(function () {
    $('#test').html(`
<div class="container">
  <div class="hello">Hello</div>
  <div class="goodbye">
    <span>Goodbye</span>
  </div>
</div>
    `);
  });

  it('.clone()', function () {
    $('.hello').clone().appendTo('.goodbye');

    assert.lengthOf($('.container').children('.hello'), 1);
    const $goodbyeChildren = $('.goodbye').children();
    assert.lengthOf($goodbyeChildren, 2);
    assert.equal($goodbyeChildren[0].innerHTML, 'Goodbye');
    assert.equal($goodbyeChildren[1].innerHTML, 'Hello');

    assert.throw($(window).clone);
  });
});
