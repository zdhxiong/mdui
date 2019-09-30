import $ from '../../jq_or_jquery';
import { JQ } from '../../../src/JQ';

describe('.prev()', function() {
  beforeEach(function() {
    $('#test').html(`
<p id="test1">a</p>
<div id="test2">b</div>
<p id="test3">c</p>
<div>
  <p>d</p>
  <div id="test4">e</div>
  <p id="test5">f</p>
  <p id="test6">g</p>
</div>
<div class="parent">
  <div id="child1-1" class="child">h</div>
  <div id="child1-2" class="child">i</div>
</div>
<div class="parent">
  <div id="child2-1" class="child">j</div>
  <div id="child2-2" class="child">k</div>
</div>
    `);
  });

  it('.prev(selector)', function() {
    function removeSpace($element: JQ<HTMLElement>): string {
      return $element
        .map((_, element) => element.innerText.trim().replace(/[\r\n]/g, ''))
        .get()
        .join('');
    }

    chai.assert.lengthOf($('#test p').prev(), 3);
    chai.assert.equal(removeSpace($('#test p').prev()), 'bef');

    chai.assert.lengthOf($('#test6').prev('#test4'), 0);

    chai.assert.lengthOf($('#test6').prev('#test5'), 1);
    chai.assert.equal(removeSpace($('#test6').prev('#test5')), 'f');

    chai.assert.lengthOf($('#test5').prev(), 1);
    chai.assert.equal(removeSpace($('#test5').prev()), 'e');

    chai.assert.lengthOf($('.child').prev(), 2);
    chai.assert.equal(removeSpace($('.child').prev()), 'hj');
  });
});
