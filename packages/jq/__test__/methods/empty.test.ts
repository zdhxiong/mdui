import { jQuery, jq, assert, JQStatic } from '../utils.js';
import '../../methods/empty.js';
import '../../methods/html.js';

const test = ($: JQStatic, type: string): void => {
  describe(`${type} - .empty`, () => {
    beforeEach(() => {
      document.querySelector('#frame')!.innerHTML = `
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
`;
    });

    it('.empty()', () => {
      const $child1 = $('#child1');
      const $result = $child1.empty();
      assert.isTrue($result.is('#child1'));
      assert.lengthOf($child1, 1);
      assert.lengthOf($('#child1-1'), 0);
      assert.lengthOf($('#child2'), 1);

      const $child2P = $('#child2 p');
      $child2P.empty();
      assert.lengthOf($child2P, 2);
      assert.isEmpty($child2P.html());
    });
  });
};

test(jq, 'jq');
test(jQuery as unknown as JQStatic, 'jQuery');
