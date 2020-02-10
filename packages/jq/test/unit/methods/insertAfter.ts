import $ from '../../jq_or_jquery';
import {
  toTagNameArray,
  toClassNameArray,
  toInnerTextArray,
  removeSpace,
} from '../../utils';

describe('.insertAfter()', function() {
  beforeEach(function() {
    $('#test').html(`
<div class="container">
  <h2>Greetings</h2>
  <div class="inner">Hello</div>
  <div class="inner">Goodbye</div>
</div>
<div class="other">other</div>
    `);
  });

  it('.insertAfter(selector)', function() {
    // 创建内容并插入到多个元素后面
    const $result = $('<p>Text</p>').insertAfter('.inner');
    chai.assert.sameOrderedMembers(toTagNameArray($result), ['p', 'p']);

    const $children = $('.container').children();
    chai.assert.sameOrderedMembers(toTagNameArray($children), [
      'h2',
      'div',
      'p',
      'div',
      'p',
    ]);
  });

  it('.insertAfter(selector)', function() {
    // 选择现有元素插入到另一元素后面
    const $result = $('.inner:last-child').insertAfter('.container h2');
    chai.assert.sameOrderedMembers(toClassNameArray($result), ['inner']);

    const $children = $('.container').children();
    chai.assert.sameOrderedMembers(toInnerTextArray($children), [
      'Greetings',
      'Goodbye',
      'Hello',
    ]);
  });

  it('.insertAfter(selector)', function() {
    // 选择现有元素插入到多个元素后面
    $('#test').html(`
<div class="container">
  <p class="p1"></p>
  <p class="p2 inner"></p>
  <p class="p3"></p>
  <p class="p4 inner"></p>
  <p class="p5"></p>
</div>
    `);

    const $result = $('.p5').insertAfter('.inner');
    chai.assert.sameOrderedMembers(toClassNameArray($result), ['p5', 'p5']);

    const $children = $('.container').children();
    chai.assert.sameOrderedMembers(toClassNameArray($children), [
      'p1',
      'p2 inner',
      'p5',
      'p3',
      'p4 inner',
      'p5',
    ]);
  });

  it('.insertAfter(selector)', function() {
    // 选择多个现有元素插入到多个元素后面
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
      .insertAfter('.inner');
    chai.assert.sameOrderedMembers(toClassNameArray($result), [
      'p5 outline',
      'p7 outline',
      'p5 outline',
      'p7 outline',
    ]);

    const $children = $('.container').children();
    chai.assert.sameOrderedMembers(toClassNameArray($children), [
      'p1',
      'p2 inner',
      'p5 outline',
      'p7 outline',
      'p3',
      'p4 inner',
      'p5 outline',
      'p7 outline',
      'p6',
    ]);

    chai.assert.isUndefined($children.eq(1).data('test_key'));
    chai.assert.equal($children.eq(2).data('test_key'), 'test_value');
    chai.assert.equal($children.eq(3).data('test_key'), 'test_value');
  });

  it('.insertAfter(html)', function() {
    let $result = $('<p>test</p>').insertAfter('<span></span>');
    chai.assert.sameOrderedMembers(toInnerTextArray($result), ['test']);

    $result = $('.inner').insertAfter('<span>ff</span>');
    chai.assert.sameOrderedMembers(toClassNameArray($result), [
      'inner',
      'inner',
    ]);
  });

  it('.insertAfter(element_jq)', function() {
    const $result = $('<p>test</p>').insertAfter($('.inner'));
    chai.assert.sameOrderedMembers(toTagNameArray($result), ['p', 'p']);

    const $children = $('.container').children();
    chai.assert.sameOrderedMembers(toTagNameArray($children), [
      'h2',
      'div',
      'p',
      'div',
      'p',
    ]);
  });

  it('.insertAfter(li)', function() {
    // 插入特殊元素
    $('#test').html(`
<ul>
  <li>a</li>
  <li>b</li>
</ul>
    `);

    const $result = $('<li>c</li><li>d</li>').insertAfter(
      $('#test ul li:last-child'),
    );
    chai.assert.sameOrderedMembers(toInnerTextArray($result), ['c', 'd']);

    const $children = $('#test ul').children();
    chai.assert.sameOrderedMembers(toInnerTextArray($children), [
      'a',
      'b',
      'c',
      'd',
    ]);
  });

  it('.insertAfter(tr)', function() {
    // 插入特殊元素
    $('#test').html(`
<table>
  <tbody>
    <tr class="first"></tr>
  </tbody>
</table>
    `);

    $('<tr class="second"></tr>').insertAfter('#test .first');
    chai.assert.equal(
      removeSpace($('#test').html()),
      '<table><tbody><trclass="first"></tr><trclass="second"></tr></tbody></table>',
    );
  });
});
