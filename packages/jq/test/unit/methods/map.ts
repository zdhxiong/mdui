import $ from '../../jq_or_jquery';

describe('.map()', function() {
  beforeEach(function() {
    $('#test').html(`
<div>a</div>
<div>b</div>
<div>c</div>
<div>d</div>
    `);
  });

  it('.map(callback)', function() {
    const $divs = $('#test div');

    const _thiss: HTMLElement[] = [];
    const _indexs: number[] = [];
    const _elements: HTMLElement[] = [];

    const ret = $divs.map(function(i, element) {
      _thiss.push(this);
      _indexs.push(i);
      _elements.push(element);

      // null 和 undefined 会被过滤
      if (i === 1) return null;
      if (i === 2) return undefined;

      return element;
    });

    chai.assert.sameOrderedMembers(_thiss, $divs.get());
    chai.assert.sameOrderedMembers(_indexs, [0, 1, 2, 3]);
    chai.assert.sameOrderedMembers(_elements, $divs.get());
    chai.assert.lengthOf(ret, 2);
    chai.assert.equal(ret.text(), 'ad');

    // 返回 index
    const ret2 = $divs
      .map(function(index) {
        return [index, index + 1];
      })
      .get()
      .join(',');
    chai.assert.equal(ret2, '0,1,1,2,2,3,3,4');
  });
});
