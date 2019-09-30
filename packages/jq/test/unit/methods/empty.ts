import $ from '../../jq_or_jquery';

describe('.empty()', function() {
  beforeEach(function() {
    $('#test').html(`
<div id="child">
  <div id="child1">
    <div id="child1-1">
      <div id="child1-1-1"></div>
    </div>
  </div>
  <div id="child2">
    <p>111</p>
    <p>222</p>
  </div>
</div>
    `);
  });

  it('.empty()', function() {
    const $result = $('#child1').empty();
    chai.assert.isTrue($result.is('#child1'));
    chai.assert.lengthOf($('#child1'), 1);
    chai.assert.lengthOf($('#child1-1'), 0);
    chai.assert.lengthOf($('#child2'), 1);

    $('#child2 p').empty();
    chai.assert.lengthOf($('#child2 p'), 2);
    chai.assert.isEmpty($('#child2 p').html());
  });
});
