import { assert } from 'chai';
import $ from '../../jq_or_jquery';

describe('$.merge', function () {
  it('$.merge(array1, array2)', function () {
    const first = ['a', 'b', 'c'];
    const second = ['c', 'd', 'e'];
    const result = $.merge(first, second);
    const exceptedResult = ['a', 'b', 'c', 'c', 'd', 'e'];

    assert.sameOrderedMembers(result, exceptedResult);
    assert.sameOrderedMembers(first, exceptedResult);
    assert.sameOrderedMembers(second, ['c', 'd', 'e']);
  });
});
