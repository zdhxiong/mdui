import $ from '../../jq_or_jquery';

describe('.get()', function() {
  this.beforeEach(function() {
    $('#test').html(`
<div>a</div>
<div>b</div>
<div>c</div>
<div>d</div>
    `);
  });

  it('.get(index)', function() {
    const $divs = $('#test div');

    chai.assert.equal($divs.get(1).innerHTML, 'b');
    chai.assert.isUndefined($divs.get(4));
    chai.assert.equal($divs.get(-1).innerHTML, 'd');
  });

  it('.get()', function() {
    const ret = $('#test div').get();
    chai.assert.isArray(ret);
    chai.assert.lengthOf(ret, 4);
    chai.assert.equal(ret[2].innerHTML, 'c');
  });
});
