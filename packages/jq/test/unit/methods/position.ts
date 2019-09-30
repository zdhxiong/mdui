import $ from '../../jq_or_jquery';

describe('.position()', function() {
  beforeEach(function() {
    $('#test').html(`
<div
  style="
    position: relative;
    margin: 10px;
  ">
  <div
    style="
      margin: 20px;
    ">
    <div
      id="child"
      style="
        position: absolute;
        left: 100px;
        top: 200px;
        margin: 15px;
        width: 150px;
        height: 120px;
      "></div>
    <div
      id="fixed"
      style="
        position: fixed;
        left: 120px;
        top: 140px;
        margin: 20px;
        padding: 10px;
      "></div>
  </div>
</div>
    `);
  });

  it('.position()', function() {
    const childPosition = $('#child').position();
    chai.assert.equal(childPosition.left, 100);
    chai.assert.equal(childPosition.top, 200);

    const fixedPosition = $('#fixed').position();
    chai.assert.equal(fixedPosition.left, 120);
    chai.assert.equal(fixedPosition.top, 140);
  });
});
