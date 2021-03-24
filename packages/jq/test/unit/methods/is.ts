import { assert } from 'chai';
import $ from '../../jq_or_jquery';

describe('.is()', function () {
  beforeEach(function () {
    $('#test').html(`
<div class="child red" id="child1">a</div>
<div class="child blue" id="child2">b</div>
<div class="child yellow" id="child3">c</div>
    `);
  });

  it('.is(selector)', function () {
    // selector
    assert.isTrue($('.child').is('.child'));
    assert.isTrue($('.child').is('#child1'));
    assert.isTrue($('.child').is('#child2'));
    assert.isFalse($('.child').is('.test'));
    assert.isTrue($('#child1').is(':first-child'));
    assert.isFalse($('#child2').is(':first-child'));
    assert.isTrue($('#child2').is('.blue'));
    assert.isFalse($('#child2').is('.red'));
    assert.isTrue($('.child').is('div'));
    assert.isFalse($('.child').is('span'));

    // Element
    assert.isTrue($('.child').is($('.child')[0]));
    assert.isFalse($('.child').is($('.child')[7]));
    assert.isFalse($('#child1').is($('#child2')[0]));

    // NodeList
    assert.isTrue($('.child').is(document.querySelectorAll('.child')));
    assert.isFalse($('.child').is(document.querySelectorAll('#test')));
    assert.isTrue($('.child').is(document.querySelectorAll('#child2')));
    assert.isTrue($('#child2').is(document.querySelectorAll('.child')));

    // Array
    assert.isTrue($('.child').is($('.child').get()));
    assert.isTrue($('#child2').is($('.child').get()));
    assert.isFalse($('#child').is($('#child1').get()));

    // JQ
    assert.isTrue($('.child').is($('.child')));
    assert.isTrue($('.child').is($('#child1')));
    assert.isTrue($('#child2').is($('.child')));
    assert.isFalse($('#child2').is($('#child1')));
    assert.isFalse($('.child').is($('#child6')));
  });

  it('.is(callback)', function () {
    const $child = $('.child');

    const _thiss: HTMLElement[] = [];
    const _indexs: number[] = [];
    const _elements: HTMLElement[] = [];

    let result = $child.is(function (index, element) {
      _thiss.push(this);
      _indexs.push(index);
      _elements.push(element);

      return true;
    });

    assert.sameOrderedMembers(_thiss, $child.get());
    assert.sameOrderedMembers(_indexs, [0, 1, 2]);
    assert.sameOrderedMembers(_elements, $child.get());
    assert.isTrue(result);

    result = $child.is(function () {
      return false;
    });
    assert.isFalse(result);

    // 只要有一个返回 true，result 就为 true
    result = $child.is(function (index) {
      return index % 2 === 0;
    });
    assert.isTrue(result);

    result = $child.is(function (index) {
      return index % 2 === 1;
    });
    assert.isTrue(result);
  });
});
