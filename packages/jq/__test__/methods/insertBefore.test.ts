import '../../methods/children.js';
import '../../methods/data.js';
import '../../methods/eq.js';
import '../../methods/html.js';
import '../../methods/insertBefore.js';
import {
  jQuery,
  jq,
  assert,
  JQStatic,
  removeSpace,
  toClassNameArray,
  toTextContentArray,
  toTagNameArray,
} from '../utils.js';

const test = ($: JQStatic, type: string): void => {
  describe(`${type} - .insertBefore`, () => {
    beforeEach(() => {
      document.querySelector('#frame')!.innerHTML = `
<div class="container">
  <h2>Greetings</h2>
  <div class="inner">Hello</div>
  <div class="inner">Goodbye</div>
</div>
<div class="other">other</div>
`;
    });

    it('.insertBefore(selector)', () => {
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

    it('.insertBefore(selector)', () => {
      // 选择现有元素插入到另一元素前
      const $result = $('.inner:last-child').insertBefore('.container h2');
      assert.sameOrderedMembers(toTagNameArray($result), ['div']);

      const $children = $('.container').children();
      assert.sameOrderedMembers(toTextContentArray($children), [
        'Goodbye',
        'Greetings',
        'Hello',
      ]);
    });

    it('.insertBefore(selector)', () => {
      // 选择现有元素插入到多个元素前
      document.querySelector('#frame')!.innerHTML = `
<div class="container">
  <p class="p1"></p>
  <p class="p2 inner"></p>
  <p class="p3"></p>
  <p class="p4 inner"></p>
  <p class="p5"></p>
</div>
`;

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

    it('.insertBefore(selector)', () => {
      // 选择多个现有元素插入到多个元素前
      document.querySelector('#frame')!.innerHTML = `
<div class="container">
  <p class="p1"></p>
  <p class="p2 inner"></p>
  <p class="p3"></p>
  <p class="p4 inner"></p>
  <p class="p5 outline"></p>
  <p class="p6"></p>
  <p class="p7 outline"></p>
</div>
`;

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

    it('.insertBefore(html)', () => {
      let $result = $('<p>test</p>').insertBefore('<span></span>');
      assert.sameOrderedMembers(toTextContentArray($result), ['test']);

      $result = $('.inner').insertBefore('<span>ff</span>');
      assert.sameOrderedMembers(toClassNameArray($result), ['inner', 'inner']);
    });

    it('.insertBefore(element_jq)', () => {
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

    it('.insertAfter(tr)', () => {
      // 插入特殊元素
      document.querySelector('#frame')!.innerHTML = `
<table>
  <tbody>
    <tr class="second"></tr>
  </tbody>
</table>
`;

      $('<tr class="first"></tr>').insertBefore('#frame .second');
      assert.equal(
        removeSpace($('#frame').html()),
        '<table><tbody><trclass="first"></tr><trclass="second"></tr></tbody></table>',
      );
    });
  });
};

test(jq, 'jq');
test(jQuery as unknown as JQStatic, 'jQuery');
