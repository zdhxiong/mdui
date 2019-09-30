import $ from '../../jq_or_jquery';

describe('.each()', function() {
  beforeEach(function() {
    $('#test').html(`
<div>a</div>
<div>b</div>
<div>c</div>
<div>d</div>
    `);
  });

  it('.each(callback)', function() {
    const thiss: string[] = [];
    const keys: number[] = [];
    const values: string[] = [];
    const ret = $('#test div').each(function(i, item): any {
      thiss.push(this.innerHTML);
      keys.push(i);
      values.push(item.innerHTML);

      if (i >= 2) {
        return false;
      }
    });

    chai.assert.lengthOf(ret, 4);
    chai.assert.sameOrderedMembers(thiss, ['a', 'b', 'c']);
    chai.assert.sameOrderedMembers(keys, [0, 1, 2]);
    chai.assert.sameOrderedMembers(values, ['a', 'b', 'c']);
  });
});
