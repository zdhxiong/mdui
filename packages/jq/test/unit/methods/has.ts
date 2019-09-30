import $ from '../../jq_or_jquery';

describe('.has()', function() {
  beforeEach(function() {
    $('#test').html(`
<div class="child" id="child1"></div>
<div class="child" id="child2">
  <div class="child2" id="child2-1"></div>
  <div class="child2" id="child2-2"></div>
</div>
<div class="child" id="child3"></div>
    `);
  });

  it('.has(selector)', function() {
    const $children = $('.child').has('#child2-1');
    chai.assert.lengthOf($children, 1);
    chai.assert.isTrue($children.eq(0).is('#child2'));

    chai.assert.lengthOf($('.child').has('.notfound'), 0);
  });

  it('.has(dom)', function() {
    const child = document.getElementById('child2-1');
    const $children = $('.child').has(child);
    chai.assert.lengthOf($children, 1);
    chai.assert.isTrue($children.eq(0).is('#child2'));
  });
});
