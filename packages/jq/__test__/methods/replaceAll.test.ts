import { jQuery, jq, assert, JQStatic, toTextContentArray } from '../utils.js';
import '../../methods/replaceAll.js';
import '../../methods/children.js';

const test = ($: JQStatic, type: string): void => {
  describe(`${type} - .replaceAll`, () => {
    beforeEach(() => {
      document.querySelector('#frame')!.innerHTML = `
<div class="container">
  <div class="inner first">Hello</div>
  <div class="inner second">And</div>
  <div class="inner third">Goodbye</div>
  <span class="other">test</span>
  <span class="other">yyy</span>
</div>
`;
    });

    it('.replaceAll(target)', () => {
      // 用新元素替换一个现有元素
      const $result = $('<p>new1</p><p>new2</p>').replaceAll('.second');
      assert.sameOrderedMembers(toTextContentArray($result), ['new1', 'new2']);

      const $children = $('.container').children();
      assert.sameOrderedMembers(toTextContentArray($children), [
        'Hello',
        'new1',
        'new2',
        'Goodbye',
        'test',
        'yyy',
      ]);
    });

    it('.replaceAll(target)', () => {
      // 用新元素替换多个现有元素
      const $result = $('<p>new1</p><p>new2</p>').replaceAll('.other');
      assert.sameOrderedMembers(toTextContentArray($result), [
        'new1',
        'new2',
        'new1',
        'new2',
      ]);

      const $children = $('.container').children();
      assert.sameOrderedMembers(toTextContentArray($children), [
        'Hello',
        'And',
        'Goodbye',
        'new1',
        'new2',
        'new1',
        'new2',
      ]);
    });

    it('.replaceAll(target)', () => {
      // 用已有元素替换一个现有元素
      const $result = $('.third').replaceAll('.other');
      assert.sameOrderedMembers(toTextContentArray($result), [
        'Goodbye',
        'Goodbye',
      ]);

      const $children = $('.container').children();
      assert.sameOrderedMembers(toTextContentArray($children), [
        'Hello',
        'And',
        'Goodbye',
        'Goodbye',
      ]);
    });

    it('.replaceAll(target)', () => {
      // 用多个已有元素替换现有元素
      const $result = $('.other').replaceAll('.inner');
      assert.sameOrderedMembers(toTextContentArray($result), [
        'test',
        'yyy',
        'test',
        'yyy',
        'test',
        'yyy',
      ]);

      const $children = $('.container').children();
      assert.sameOrderedMembers(toTextContentArray($children), [
        'test',
        'yyy',
        'test',
        'yyy',
        'test',
        'yyy',
      ]);
    });
  });
};

test(jq, 'jq');
test(jQuery as unknown as JQStatic, 'jQuery');
