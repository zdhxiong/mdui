import '../../methods/first.js';
import { jQuery, jq, assert, JQStatic, toIdArray } from '../utils.js';

const test = ($: JQStatic, type: string): void => {
  describe(`${type} - .first`, () => {
    beforeEach(() => {
      document.querySelector('#frame')!.innerHTML = `
<ul>
  <li id="child-1">list item 1</li>
  <li id="child-2">list item 2</li>
  <li id="child-3">list item 3</li>
  <li id="child-4">list item 4</li>
  <li id="child-5">list item 5</li>
</ul>
`;
    });

    it('.first()', () => {
      let $first = $('#frame li').first();
      assert.sameOrderedMembers(toIdArray($first), ['child-1']);

      $first = $('#notfound').first();
      assert.lengthOf($first, 0);
    });
  });
};

test(jq, 'jq');
test(jQuery as unknown as JQStatic, 'jQuery');
