import { jQuery, jq, assert, JQStatic } from '../utils.js';
import '../../methods/slice.js';
import '../../methods/get.js';
import '../../methods/text.js';

const test = ($: JQStatic, type: string): void => {
  describe(`${type} - .slice`, () => {
    beforeEach(() => {
      document.querySelector('#frame')!.innerHTML = `
<div>a</div>
<div>b</div>
<div>c</div>
<div>d</div>
<div>e</div>
`;
    });

    it('.slice(start: number, end?: number): JQ', () => {
      const $divs = $('#frame div');
      const $ret = $divs.slice(2);

      assert.lengthOf($ret, 3);
      assert.deepEqual($ret[0], $divs.get(2));
      assert.deepEqual($ret[1], $divs.get(3));
      assert.deepEqual($ret[2], $divs.get(4));
      assert.equal($ret.text(), 'cde');

      assert.equal($divs.slice(2, 4).text(), 'cd');
      assert.equal($divs.slice(-2).text(), 'de');
      assert.equal($divs.slice(-2, -1).text(), 'd');
      assert.equal($divs.slice(2, -1).text(), 'cd');
      assert.equal($divs.slice(0, 1).text(), 'a');
      assert.equal($divs.slice(0, 2).text(), 'ab');
    });
  });
};

test(jq, 'jq');
test(jQuery as unknown as JQStatic, 'jQuery');
