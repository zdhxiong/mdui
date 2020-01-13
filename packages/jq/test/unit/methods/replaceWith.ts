import $ from '../../jq_or_jquery';
import { toInnerTextArray, removeSpace } from '../../utils';

describe('.replaceWith()', function() {
  beforeEach(function() {
    $('#test').html(`
<div class="container">
  <div class="inner first">Hello</div>
  <div class="inner second">And</div>
  <div class="inner third">Goodbye</div>
  <span class="other">test</span>
  <span class="other">yyy</span>
</div>
    `);
  });

  it('.replaceWith(html)', function() {
    // 单个元素替换成一个新元素
    const $result = $('.inner.second').replaceWith('<p>new</p>');
    chai.assert.sameOrderedMembers(toInnerTextArray($result), ['And']);

    const $children = $('.container').children();
    chai.assert.sameOrderedMembers(toInnerTextArray($children), [
      'Hello',
      'new',
      'Goodbye',
      'test',
      'yyy',
    ]);
  });

  it('.replaceWith(html)', function() {
    // 多个元素替换成一个新元素
    const $result = $('.inner').replaceWith('<p>new</p>');
    chai.assert.sameOrderedMembers(toInnerTextArray($result), [
      'Hello',
      'And',
      'Goodbye',
    ]);

    const $children = $('.container').children();
    chai.assert.sameOrderedMembers(toInnerTextArray($children), [
      'new',
      'new',
      'new',
      'test',
      'yyy',
    ]);
  });

  it('.replaceWith(html)', function() {
    // 单个元素替换成多个新元素
    const $result = $('.second').replaceWith('<p>new1</p><p>new2</p>');
    chai.assert.sameOrderedMembers(toInnerTextArray($result), ['And']);

    const $children = $('.container').children();
    chai.assert.sameOrderedMembers(toInnerTextArray($children), [
      'Hello',
      'new1',
      'new2',
      'Goodbye',
      'test',
      'yyy',
    ]);
  });

  it('.replaceWith(html)', function() {
    // 多个元素替换成多个新元素
    const $result = $('.other').replaceWith('<p>new1</p><p>new2</p>');
    chai.assert.sameOrderedMembers(toInnerTextArray($result), ['test', 'yyy']);

    const $children = $('.container').children();
    chai.assert.sameOrderedMembers(toInnerTextArray($children), [
      'Hello',
      'And',
      'Goodbye',
      'new1',
      'new2',
      'new1',
      'new2',
    ]);
  });

  it('.replaceWith(target)', function() {
    // 单个元素替换成一个已有元素
    const $result = $('.second').replaceWith($('.other:last-child'));
    chai.assert.sameOrderedMembers(toInnerTextArray($result), ['And']);

    const $children = $('.container').children();
    chai.assert.sameOrderedMembers(toInnerTextArray($children), [
      'Hello',
      'yyy',
      'Goodbye',
      'test',
    ]);
  });

  it('.replaceWith(target)', function() {
    // 多个元素替换成一个已有元素
    const $result = $('.inner').replaceWith($('.other:last-child'));
    chai.assert.sameOrderedMembers(toInnerTextArray($result), [
      'Hello',
      'And',
      'Goodbye',
    ]);

    const $children = $('.container').children();
    chai.assert.sameOrderedMembers(toInnerTextArray($children), [
      'yyy',
      'yyy',
      'yyy',
      'test',
    ]);
  });

  it('.replaceWith(target)', function() {
    // 单个元素替换成多个已有元素
    $('.second').replaceWith($('.other'));

    const $children = $('.container').children();
    chai.assert.sameOrderedMembers(toInnerTextArray($children), [
      'Hello',
      'test',
      'yyy',
      'Goodbye',
    ]);
  });

  it('.replaceWith(target)', function() {
    // 多个元素替换成多个已有元素
    $('.inner').replaceWith($('.other'));

    const $children = $('.container').children();
    chai.assert.sameOrderedMembers(toInnerTextArray($children), [
      'test',
      'yyy',
      'test',
      'yyy',
      'test',
      'yyy',
    ]);
  });

  it('.replaceWith(callback)', function() {
    // 通过回调函数返回
    $('.second').replaceWith(function() {
      return $('.other');
    });

    const $children = $('.container').children();
    chai.assert.sameOrderedMembers(toInnerTextArray($children), [
      'Hello',
      'test',
      'yyy',
      'Goodbye',
    ]);
  });

  it('.replaceWith(callback)', function() {
    // 通过回调函数返回
    const _thiss: HTMLElement[] = [];
    const _indexs: number[] = [];
    const _htmls: string[] = [];
    $('.inner').replaceWith(function(index, html) {
      _thiss.push(this);
      _indexs.push(index);
      _htmls.push(html);

      return $('.other');
    });
    chai.assert.sameOrderedMembers(
      _thiss.map(e => e.innerText),
      ['Hello', 'And', 'Goodbye'],
    );
    chai.assert.sameOrderedMembers(_indexs, [0, 1, 2]);
    chai.assert.sameOrderedMembers(_htmls, ['Hello', 'And', 'Goodbye']);

    const $children = $('.container').children();
    chai.assert.sameOrderedMembers(toInnerTextArray($children), [
      'test',
      'yyy',
    ]);
  });

  it('.replaceWith(text)', function() {
    // 替换成文本
    $('.inner').replaceWith('new');

    const text = $('.container').text();
    chai.assert.equal(removeSpace(text), 'newnewnewtestyyy');
  });

  it('.replaceWith(text_callback)', function() {
    // 用回调函数返回文本
    $('.inner').replaceWith(function(index, html) {
      return html + index + 'new';
    });

    const text = $('.container').text();
    chai.assert.equal(removeSpace(text), 'Hello0newAnd1newGoodbye2newtestyyy');
  });
});
