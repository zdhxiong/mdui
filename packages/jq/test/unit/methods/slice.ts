import $ from '../../jq_or_jquery';

describe('.slice()', function() {
  beforeEach(function() {
    $('#test').html(`
<div>a</div>
<div>b</div>
<div>c</div>
<div>d</div>
<div>e</div>
    `);
  });

  it('.slice(start: number, end?: number): JQ', function() {
    const $divs = $('#test div');
    const $ret = $divs.slice(2);

    chai.assert.lengthOf($ret, 3);
    chai.assert.deepEqual($ret[0], $('#test div').get(2));
    chai.assert.deepEqual($ret[1], $('#test div').get(3));
    chai.assert.deepEqual($ret[2], $('#test div').get(4));
    chai.assert.equal($ret.text(), 'cde');

    chai.assert.equal($divs.slice(2, 4).text(), 'cd');
    chai.assert.equal($divs.slice(-2).text(), 'de');
    chai.assert.equal($divs.slice(-2, -1).text(), 'd');
    chai.assert.equal($divs.slice(2, -1).text(), 'cd');
    chai.assert.equal($divs.slice(0, 1).text(), 'a');
    chai.assert.equal($divs.slice(0, 2).text(), 'ab');
  });
});
