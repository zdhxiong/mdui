import { jQuery, jq, assert, JQStatic } from '../utils.js';
import '../../methods/each.js';

const test = ($: JQStatic, type: string): void => {
  describe(`${type} - .each`, () => {
    beforeEach(() => {
      document.querySelector('#frame')!.innerHTML = `
<div>a</div>
<div>b</div>
<div>c</div>
<div>d</div>
`;
    });

    it('.each(callback)', () => {
      const thiss: string[] = [];
      const keys: number[] = [];
      const values: string[] = [];
      const ret = $('#frame div').each(function (i, item) {
        thiss.push(this.innerHTML);
        keys.push(i);
        values.push(item.innerHTML);

        if (i >= 2) {
          return false;
        }
      });

      assert.lengthOf(ret, 4);
      assert.sameOrderedMembers(thiss, ['a', 'b', 'c']);
      assert.sameOrderedMembers(keys, [0, 1, 2]);
      assert.sameOrderedMembers(values, ['a', 'b', 'c']);
    });
  });
};

test(jq, 'jq');
test(jQuery as unknown as JQStatic, 'jQuery');
