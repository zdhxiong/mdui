import { assert } from 'chai';
import $ from '../../jq_or_jquery';

describe('.slice()', function () {
  beforeEach(function () {
    $('#test').html(`
<div>a</div>
<div>b</div>
<div>c</div>
<div>d</div>
<div>e</div>
    `);
  });

  it('.slice(start: number, end?: number): JQ', function () {
    const $divs = $('#test div');
    const $ret = $divs.slice(2);

    assert.lengthOf($ret, 3);
    assert.deepEqual($ret[0], $('#test div').get(2));
    assert.deepEqual($ret[1], $('#test div').get(3));
    assert.deepEqual($ret[2], $('#test div').get(4));
    assert.equal($ret.text(), 'cde');

    assert.equal($divs.slice(2, 4).text(), 'cd');
    assert.equal($divs.slice(-2).text(), 'de');
    assert.equal($divs.slice(-2, -1).text(), 'd');
    assert.equal($divs.slice(2, -1).text(), 'cd');
    assert.equal($divs.slice(0, 1).text(), 'a');
    assert.equal($divs.slice(0, 2).text(), 'ab');
  });
});
