import '../../static/merge.js';
import { jQuery, jq, assert, JQStatic } from '../utils.js';

const test = ($: JQStatic, type: string): void => {
  describe(`${type} - $.merge`, () => {
    it('$.merge(array1, array2)', () => {
      const first = ['a', 'b', 'c'];
      const second = ['c', 'd', 'e'];
      const result = $.merge(first, second);
      const exceptedResult = ['a', 'b', 'c', 'c', 'd', 'e'];

      assert.sameOrderedMembers(result, exceptedResult);
      assert.sameOrderedMembers(first, exceptedResult);
      assert.sameOrderedMembers(second, ['c', 'd', 'e']);
    });
  });
};

test(jq, 'jq');
test(jQuery as unknown as JQStatic, 'jQuery');
