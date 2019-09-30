import $ from '../../jq_or_jquery';

describe('.clone()', function() {
  beforeEach(function() {
    $('#test').html(`
<div class="container">
  <div class="hello">Hello</div>
  <div class="goodbye">
    <span>Goodbye</span>
  </div>
</div>
    `);
  });

  it('.clone()', function() {
    $('.hello')
      .clone()
      .appendTo('.goodbye');

    chai.assert.lengthOf($('.container').children('.hello'), 1);
    const $goodbyeChildren = $('.goodbye').children();
    chai.assert.lengthOf($goodbyeChildren, 2);
    chai.assert.equal($goodbyeChildren[0].innerHTML, 'Goodbye');
    chai.assert.equal($goodbyeChildren[1].innerHTML, 'Hello');

    chai.assert.throw($(window).clone);
  });
});
