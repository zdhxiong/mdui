import '../../methods/get.js';
import { jQuery, jq, assert, JQStatic } from '../utils.js';

const test = ($: JQStatic, type: string): void => {
  describe(`${type} - .get`, () => {
    beforeEach(() => {
      document.querySelector('#frame')!.innerHTML = `
<div>a</div>
<div>b</div>
<div>c</div>
<div>d</div>
`;
    });

    it('.get(index)', () => {
      const $divs = $('#frame div');

      assert.equal($divs.get(1).innerHTML, 'b');
      assert.isUndefined($divs.get(4));
      assert.equal($divs.get(-1).innerHTML, 'd');
    });

    it('.get()', () => {
      const ret = $('#frame div').get();
      assert.isArray(ret);
      assert.lengthOf(ret, 4);
      assert.equal(ret[2].innerHTML, 'c');
    });
  });
};

test(jq, 'jq');
test(jQuery as unknown as JQStatic, 'jQuery');
