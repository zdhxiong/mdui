import $ from '../../jq_or_jquery';

describe('.is()', function() {
  beforeEach(function() {
    $('#test').html(`
<div class="child red" id="child1">a</div>
<div class="child blue" id="child2">b</div>
<div class="child yellow" id="child3">c</div>
    `);
  });

  it('.is(selector)', function() {
    // selector
    chai.assert.isTrue($('.child').is('.child'));
    chai.assert.isTrue($('.child').is('#child1'));
    chai.assert.isTrue($('.child').is('#child2'));
    chai.assert.isFalse($('.child').is('.test'));
    chai.assert.isTrue($('#child1').is(':first-child'));
    chai.assert.isFalse($('#child2').is(':first-child'));
    chai.assert.isTrue($('#child2').is('.blue'));
    chai.assert.isFalse($('#child2').is('.red'));
    chai.assert.isTrue($('.child').is('div'));
    chai.assert.isFalse($('.child').is('span'));

    // Element
    chai.assert.isTrue($('.child').is($('.child')[0]));
    chai.assert.isFalse($('.child').is($('.child')[7]));
    chai.assert.isFalse($('#child1').is($('#child2')[0]));

    // NodeList
    chai.assert.isTrue($('.child').is(document.querySelectorAll('.child')));
    chai.assert.isFalse($('.child').is(document.querySelectorAll('#test')));
    chai.assert.isTrue($('.child').is(document.querySelectorAll('#child2')));
    chai.assert.isTrue($('#child2').is(document.querySelectorAll('.child')));

    // Array
    chai.assert.isTrue($('.child').is($('.child').get()));
    chai.assert.isTrue($('#child2').is($('.child').get()));
    chai.assert.isFalse($('#child').is($('#child1').get()));

    // JQ
    chai.assert.isTrue($('.child').is($('.child')));
    chai.assert.isTrue($('.child').is($('#child1')));
    chai.assert.isTrue($('#child2').is($('.child')));
    chai.assert.isFalse($('#child2').is($('#child1')));
    chai.assert.isFalse($('.child').is($('#child6')));
  });

  it('.is(callback)', function() {
    const $child = $('.child');

    const _thiss: HTMLElement[] = [];
    const _indexs: number[] = [];
    const _elements: HTMLElement[] = [];

    let result = $child.is(function(index, element) {
      _thiss.push(this);
      _indexs.push(index);
      _elements.push(element);

      return true;
    });

    chai.assert.sameOrderedMembers(_thiss, $child.get());
    chai.assert.sameOrderedMembers(_indexs, [0, 1, 2]);
    chai.assert.sameOrderedMembers(_elements, $child.get());
    chai.assert.isTrue(result);

    result = $child.is(function() {
      return false;
    });
    chai.assert.isFalse(result);

    // 只要有一个返回 true，result 就为 true
    result = $child.is(function(index) {
      return index % 2 === 0;
    });
    chai.assert.isTrue(result);

    result = $child.is(function(index) {
      return index % 2 === 1;
    });
    chai.assert.isTrue(result);
  });
});
