import $ from '../../jq_or_jquery';
import { toInnerTextArray } from '../../utils';

describe('.replaceAll()', function() {
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

  it('.replaceAll(target)', function() {
    // 用新元素替换一个现有元素
    const $result = $('<p>new1</p><p>new2</p>').replaceAll('.second');
    chai.assert.sameOrderedMembers(toInnerTextArray($result), ['new1', 'new2']);

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

  it('.replaceAll(target)', function() {
    // 用新元素替换多个现有元素
    const $result = $('<p>new1</p><p>new2</p>').replaceAll('.other');
    chai.assert.sameOrderedMembers(toInnerTextArray($result), [
      'new1',
      'new2',
      'new1',
      'new2',
    ]);

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

  it('.replaceAll(target)', function() {
    // 用已有元素替换一个现有元素
    const $result = $('.third').replaceAll('.other');
    chai.assert.sameOrderedMembers(toInnerTextArray($result), [
      'Goodbye',
      'Goodbye',
    ]);

    const $children = $('.container').children();
    chai.assert.sameOrderedMembers(toInnerTextArray($children), [
      'Hello',
      'And',
      'Goodbye',
      'Goodbye',
    ]);
  });

  it('.replaceAll(target)', function() {
    // 用多个已有元素替换现有元素
    const $result = $('.other').replaceAll('.inner');
    chai.assert.sameOrderedMembers(toInnerTextArray($result), [
      'test',
      'yyy',
      'test',
      'yyy',
      'test',
      'yyy',
    ]);

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
});
