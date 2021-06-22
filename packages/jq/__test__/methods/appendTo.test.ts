import {
  jQuery,
  jq,
  assert,
  JQStatic,
  removeSpace,
  toInnerHtmlArray,
  toTagNameArray,
} from '../utils.js';
import '../../methods/appendTo.js';

const test = ($: JQStatic, type: string): void => {
  describe(`${type} - .appendTo`, () => {
    beforeEach(() => {
      document.querySelector('#frame')!.innerHTML = `
<h2>Greetings</h2>
<div class="container">
  <div class="inner">Hello</div>
  <div class="inner">Goodbye</div>
  <span class="test">test</span>
</div>
`;
    });

    it('.appendTo(selector)', () => {
      // 创建新内容，插入到单个现有元素中
      const $result = $('<p>new</p>').appendTo('.inner:first-child');
      assert.sameOrderedMembers(toTagNameArray($result), ['p']);

      const html = $('.container .inner:first-child')[0].innerHTML;
      assert.equal(html, 'Hello<p>new</p>');
    });

    it('.appendTo(empty_element)', () => {
      // 创建新元素，添加到一个空元素中
      $('#frame')[0].innerHTML = `
<div class="container">
  <div class="inner"></div>
  <div class="inner"></div>
</div>
`;

      $('<p>new1</p><label>new2</label>').appendTo('.inner');

      const html = $('.container')[0].innerHTML;
      assert.equal(
        removeSpace(html),
        '<divclass="inner"><p>new1</p><label>new2</label></div><divclass="inner"><p>new1</p><label>new2</label></div>',
      );
    });

    it('.appendTo(elements)', () => {
      // 创建新内容，插入到多个现有元素中
      const $result = $('<p>new</p>').appendTo('.inner');
      assert.sameOrderedMembers(toTagNameArray($result), ['p', 'p']);

      const html = $('.container')[0].innerHTML;
      assert.equal(
        removeSpace(html),
        '<divclass="inner">Hello<p>new</p></div><divclass="inner">Goodbye<p>new</p></div><spanclass="test">test</span>',
      );
    });

    it('.appendTo(JQ)', () => {
      // 创建多个新内容，插入到多个现有元素中
      const $result = $('<p>new1</p><label>new2</label>').appendTo($('.inner'));
      assert.sameOrderedMembers(toTagNameArray($result), [
        'p',
        'label',
        'p',
        'label',
      ]);
      assert.sameOrderedMembers(toInnerHtmlArray($result), [
        'new1',
        'new2',
        'new1',
        'new2',
      ]);

      const html = $('.container')[0].innerHTML;
      assert.equal(
        removeSpace(html),
        '<divclass="inner">Hello<p>new1</p><label>new2</label></div><divclass="inner">Goodbye<p>new1</p><label>new2</label></div><spanclass="test">test</span>',
      );
    });

    it('.appentTo(elements)', () => {
      // 创建多个新内容，插入到多个新元素中
      const $result = $('<p>new1</p><label>new2</label>')
        .appendTo('<section>wrapper1</section><section>wrapper2</section>')
        .appendTo('.inner');
      assert.sameOrderedMembers(toTagNameArray($result), [
        'p',
        'label',
        'p',
        'label',
        'p',
        'label',
        'p',
        'label',
      ]);

      const html = $('.container')[0].innerHTML;
      assert.equal(
        removeSpace(html),
        '<divclass="inner">Hello<p>new1</p><label>new2</label><p>new1</p><label>new2</label></div><divclass="inner">Goodbye<p>new1</p><label>new2</label><p>new1</p><label>new2</label></div><spanclass="test">test</span>',
      );
    });

    it('.appentTo()', () => {
      // 选择现有元素，插入到现有元素中
      const $result = $('#frame h2, #frame .test').appendTo('#frame .inner');
      assert.sameOrderedMembers(toTagNameArray($result), [
        'h2',
        'span',
        'h2',
        'span',
      ]);

      const html = $('#frame')[0].innerHTML;
      assert.equal(
        removeSpace(html),
        '<divclass="container"><divclass="inner">Hello<h2>Greetings</h2><spanclass="test">test</span></div><divclass="inner">Goodbye<h2>Greetings</h2><spanclass="test">test</span></div></div>',
      );
    });
  });
};

test(jq, 'jq');
test(jQuery as unknown as JQStatic, 'jQuery');
