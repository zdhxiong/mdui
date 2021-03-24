import { assert } from 'chai';
import $ from '../../jq_or_jquery';
import {
  toTagNameArray,
  toClassNameArray,
  toInnerTextArray,
  removeSpace,
} from '../../utils';

describe('.insertBefore()', function () {
  beforeEach(function () {
    $('#test').html(`
<div class="container">
  <h2>Greetings</h2>
  <div class="inner">Hello</div>
  <div class="inner">Goodbye</div>
</div>
<div class="other">other</div>
    `);
  });

  it('.insertBefore(selector)', function () {
    // 创建内容并插入到多个元素前
    const $result = $('<p>Text</p>').insertBefore('.inner');
    assert.sameOrderedMembers(toTagNameArray($result), ['p', 'p']);

    const $children = $('.container').children();
    assert.sameOrderedMembers(toTagNameArray($children), [
      'h2',
      'p',
      'div',
      'p',
      'div',
    ]);
  });

  it('.insertBefore(selector)', function () {
    // 选择现有元素插入到另一元素前
    const $result = $('.inner:last-child').insertBefore('.container h2');
    assert.sameOrderedMembers(toTagNameArray($result), ['div']);

    const $children = $('.container').children();
    assert.sameOrderedMembers(toInnerTextArray($children), [
      'Goodbye',
      'Greetings',
      'Hello',
    ]);
  });

  it('.insertBefore(selector)', function () {
    // 选择现有元素插入到多个元素前
    $('#test').html(`
<div class="container">
  <p class="p1"></p>
  <p class="p2 inner"></p>
  <p class="p3"></p>
  <p class="p4 inner"></p>
  <p class="p5"></p>
</div>
    `);

    const $result = $('.p5').insertBefore('.inner');
    assert.sameOrderedMembers(toClassNameArray($result), ['p5', 'p5']);

    const $children = $('.container').children();
    assert.sameOrderedMembers(toClassNameArray($children), [
      'p1',
      'p5',
      'p2 inner',
      'p3',
      'p5',
      'p4 inner',
    ]);
  });

  it('.insertBefore(selector)', function () {
    // 选择多个现有元素插入到多个元素前
    $('#test').html(`
<div class="container">
  <p class="p1"></p>
  <p class="p2 inner"></p>
  <p class="p3"></p>
  <p class="p4 inner"></p>
  <p class="p5 outline"></p>
  <p class="p6"></p>
  <p class="p7 outline"></p>
</div>
    `);

    const $result = $('.outline')
      .data('test_key', 'test_value')
      .insertBefore('.inner');
    assert.sameOrderedMembers(toClassNameArray($result), [
      'p5 outline',
      'p7 outline',
      'p5 outline',
      'p7 outline',
    ]);

    const $children = $('.container').children();
    assert.sameOrderedMembers(toClassNameArray($children), [
      'p1',
      'p5 outline',
      'p7 outline',
      'p2 inner',
      'p3',
      'p5 outline',
      'p7 outline',
      'p4 inner',
      'p6',
    ]);

    assert.equal($children.eq(1).data('test_key'), 'test_value');
    assert.equal($children.eq(2).data('test_key'), 'test_value');
    assert.isUndefined($children.eq(3).data('test_key'));
  });

  it('.insertBefore(html)', function () {
    let $result = $('<p>test</p>').insertBefore('<span></span>');
    assert.sameOrderedMembers(toInnerTextArray($result), ['test']);

    $result = $('.inner').insertBefore('<span>ff</span>');
    assert.sameOrderedMembers(toClassNameArray($result), ['inner', 'inner']);
  });

  it('.insertBefore(element_jq)', function () {
    const $result = $('<p>test</p>').insertBefore($('.inner'));
    assert.sameOrderedMembers(toTagNameArray($result), ['p', 'p']);

    const $children = $('.container').children();
    assert.sameOrderedMembers(toTagNameArray($children), [
      'h2',
      'p',
      'div',
      'p',
      'div',
    ]);
  });

  it('.insertAfter(tr)', function () {
    // 插入特殊元素
    $('#test').html(`
<table>
  <tbody>
    <tr class="second"></tr>
  </tbody>
</table>
    `);

    $('<tr class="first"></tr>').insertBefore('#test .second');
    assert.equal(
      removeSpace($('#test').html()),
      '<table><tbody><trclass="first"></tr><trclass="second"></tr></tbody></table>',
    );
  });
});
