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
import '../../methods/insertAfter.js';
import '../../methods/children.js';
import '../../methods/data.js';
import '../../methods/eq.js';
import '../../methods/html.js';

const test = ($: JQStatic, type: string): void => {
  describe(`${type} - .insertAfter`, () => {
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

    it('.insertAfter(selector)', () => {
      // 创建内容并插入到多个元素后面
      const $result = $('<p>Text</p>').insertAfter('.inner');
      assert.sameOrderedMembers(toTagNameArray($result), ['p', 'p']);

      const $children = $('.container').children();
      assert.sameOrderedMembers(toTagNameArray($children), [
        'h2',
        'div',
        'p',
        'div',
        'p',
      ]);
    });

    it('.insertAfter(selector)', () => {
      // 选择现有元素插入到另一元素后面
      const $result = $('.inner:last-child').insertAfter('.container h2');
      assert.sameOrderedMembers(toClassNameArray($result), ['inner']);

      const $children = $('.container').children();
      assert.sameOrderedMembers(toTextContentArray($children), [
        'Greetings',
        'Goodbye',
        'Hello',
      ]);
    });

    it('.insertAfter(selector)', () => {
      // 选择现有元素插入到多个元素后面
      document.querySelector('#frame')!.innerHTML = `
<div class="container">
  <p class="p1"></p>
  <p class="p2 inner"></p>
  <p class="p3"></p>
  <p class="p4 inner"></p>
  <p class="p5"></p>
</div>
`;

      const $result = $('.p5').insertAfter('.inner');
      assert.sameOrderedMembers(toClassNameArray($result), ['p5', 'p5']);

      const $children = $('.container').children();
      assert.sameOrderedMembers(toClassNameArray($children), [
        'p1',
        'p2 inner',
        'p5',
        'p3',
        'p4 inner',
        'p5',
      ]);
    });

    it('.insertAfter(selector)', () => {
      // 选择多个现有元素插入到多个元素后面
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
        .insertAfter('.inner');
      assert.sameOrderedMembers(toClassNameArray($result), [
        'p5 outline',
        'p7 outline',
        'p5 outline',
        'p7 outline',
      ]);

      const $children = $('.container').children();
      assert.sameOrderedMembers(toClassNameArray($children), [
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

      assert.isUndefined($children.eq(1).data('test_key'));
      assert.equal($children.eq(2).data('test_key'), 'test_value');
      assert.equal($children.eq(3).data('test_key'), 'test_value');
    });

    it('.insertAfter(html)', () => {
      let $result = $('<p>test</p>').insertAfter('<span></span>');
      assert.sameOrderedMembers(toTextContentArray($result), ['test']);

      $result = $('.inner').insertAfter('<span>ff</span>');
      assert.sameOrderedMembers(toClassNameArray($result), ['inner', 'inner']);
    });

    it('.insertAfter(element_jq)', () => {
      const $result = $('<p>test</p>').insertAfter($('.inner'));
      assert.sameOrderedMembers(toTagNameArray($result), ['p', 'p']);

      const $children = $('.container').children();
      assert.sameOrderedMembers(toTagNameArray($children), [
        'h2',
        'div',
        'p',
        'div',
        'p',
      ]);
    });

    it('.insertAfter(li)', () => {
      // 插入特殊元素
      document.querySelector('#frame')!.innerHTML = `
<ul>
  <li>a</li>
  <li>b</li>
</ul>
`;

      const $result = $('<li>c</li><li>d</li>').insertAfter(
        $('#frame ul li:last-child'),
      );
      assert.sameOrderedMembers(toTextContentArray($result), ['c', 'd']);

      const $children = $('#frame ul').children();
      assert.sameOrderedMembers(toTextContentArray($children), [
        'a',
        'b',
        'c',
        'd',
      ]);
    });

    it('.insertAfter(tr)', () => {
      // 插入特殊元素
      document.querySelector('#frame')!.innerHTML = `
<table>
  <tbody>
    <tr class="first"></tr>
  </tbody>
</table>
`;

      $('<tr class="second"></tr>').insertAfter('#frame .first');
      assert.equal(
        removeSpace($('#frame').html()),
        '<table><tbody><trclass="first"></tr><trclass="second"></tr></tbody></table>',
      );
    });
  });
};

test(jq, 'jq');
test(jQuery as unknown as JQStatic, 'jQuery');
