import '../../methods/children.js';
import '../../methods/replaceWith.js';
import '../../methods/text.js';
import {
  jQuery,
  jq,
  assert,
  JQStatic,
  removeSpace,
  toTextContentArray,
} from '../utils.js';

const test = ($: JQStatic, type: string): void => {
  describe(`${type} - .replaceWith`, () => {
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

    it('.replaceWith(html)', () => {
      // 单个元素替换成一个新元素
      const $result = $('.inner.second').replaceWith('<p>new</p>');
      assert.sameOrderedMembers(toTextContentArray($result), ['And']);

      const $children = $('.container').children();
      assert.sameOrderedMembers(toTextContentArray($children), [
        'Hello',
        'new',
        'Goodbye',
        'test',
        'yyy',
      ]);
    });

    it('.replaceWith(html)', () => {
      // 多个元素替换成一个新元素
      const $result = $('.inner').replaceWith('<p>new</p>');
      assert.sameOrderedMembers(toTextContentArray($result), [
        'Hello',
        'And',
        'Goodbye',
      ]);

      const $children = $('.container').children();
      assert.sameOrderedMembers(toTextContentArray($children), [
        'new',
        'new',
        'new',
        'test',
        'yyy',
      ]);
    });

    it('.replaceWith(html)', () => {
      // 单个元素替换成多个新元素
      const $result = $('.second').replaceWith('<p>new1</p><p>new2</p>');
      assert.sameOrderedMembers(toTextContentArray($result), ['And']);

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

    it('.replaceWith(html)', () => {
      // 多个元素替换成多个新元素
      const $result = $('.other').replaceWith('<p>new1</p><p>new2</p>');
      assert.sameOrderedMembers(toTextContentArray($result), ['test', 'yyy']);

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

    it('.replaceWith(target)', () => {
      // 单个元素替换成一个已有元素
      const $result = $('.second').replaceWith($('.other:last-child'));
      assert.sameOrderedMembers(toTextContentArray($result), ['And']);

      const $children = $('.container').children();
      assert.sameOrderedMembers(toTextContentArray($children), [
        'Hello',
        'yyy',
        'Goodbye',
        'test',
      ]);
    });

    it('.replaceWith(target)', () => {
      // 多个元素替换成一个已有元素
      const $result = $('.inner').replaceWith($('.other:last-child'));
      assert.sameOrderedMembers(toTextContentArray($result), [
        'Hello',
        'And',
        'Goodbye',
      ]);

      const $children = $('.container').children();
      assert.sameOrderedMembers(toTextContentArray($children), [
        'yyy',
        'yyy',
        'yyy',
        'test',
      ]);
    });

    it('.replaceWith(target)', () => {
      // 单个元素替换成多个已有元素
      $('.second').replaceWith($('.other'));

      const $children = $('.container').children();
      assert.sameOrderedMembers(toTextContentArray($children), [
        'Hello',
        'test',
        'yyy',
        'Goodbye',
      ]);
    });

    it('.replaceWith(target)', () => {
      // 多个元素替换成多个已有元素
      $('.inner').replaceWith($('.other'));

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

    it('.replaceWith(callback)', () => {
      // 通过回调函数返回
      $('.second').replaceWith(() => {
        return $('.other');
      });

      const $children = $('.container').children();
      assert.sameOrderedMembers(toTextContentArray($children), [
        'Hello',
        'test',
        'yyy',
        'Goodbye',
      ]);
    });

    it('.replaceWith(callback)', () => {
      // 通过回调函数返回
      const _thiss: HTMLElement[] = [];
      const _indexs: number[] = [];
      const _htmls: string[] = [];
      $('.inner').replaceWith(function (index, html) {
        _thiss.push(this);
        _indexs.push(index);
        _htmls.push(html);

        return $('.other');
      });
      assert.sameOrderedMembers(
        _thiss.map((e) => e.innerText),
        ['Hello', 'And', 'Goodbye'],
      );
      assert.sameOrderedMembers(_indexs, [0, 1, 2]);
      assert.sameOrderedMembers(_htmls, ['Hello', 'And', 'Goodbye']);

      const $children = $('.container').children();
      assert.sameOrderedMembers(toTextContentArray($children), ['test', 'yyy']);
    });

    it('.replaceWith(text)', () => {
      // 替换成文本
      $('.inner').replaceWith('new');

      const text = $('.container').text();
      assert.equal(removeSpace(text), 'newnewnewtestyyy');
    });

    it('.replaceWith(text_callback)', () => {
      // 用回调函数返回文本
      $('.inner').replaceWith((index, html) => {
        return html + index + 'new';
      });

      const text = $('.container').text();
      assert.equal(removeSpace(text), 'Hello0newAnd1newGoodbye2newtestyyy');
    });
  });
};

test(jq, 'jq');
test(jQuery as unknown as JQStatic, 'jQuery');
