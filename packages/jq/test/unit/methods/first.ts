import $ from '../../jq_or_jquery';
import { toIdArray } from '../../utils';

describe('.first()', function() {
  beforeEach(function() {
    $('#test').html(`
<ul>
  <li id="child-1">list item 1</li>
  <li id="child-2">list item 2</li>
  <li id="child-3">list item 3</li>
  <li id="child-4">list item 4</li>
  <li id="child-5">list item 5</li>
</ul>
    `);
  });

  it('.first()', function() {
    let $first = $('#test li').first();
    chai.assert.sameOrderedMembers(toIdArray($first), ['child-1']);

    $first = $('#notfound').first();
    chai.assert.lengthOf($first, 0);
  });
});
