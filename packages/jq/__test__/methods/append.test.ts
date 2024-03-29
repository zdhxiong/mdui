import '../../methods/append.js';
import '../../methods/appendTo.js';
import '../../methods/children.js';
import {
  jQuery,
  jq,
  assert,
  JQStatic,
  toClassNameArray,
  toTagNameArray,
  toTextContentArray,
  removeSpace,
  toInnerHtmlArray,
} from '../utils.js';

const test = ($: JQStatic, type: string): void => {
  describe(`${type} - .append`, () => {
    beforeEach(() => {
      document.querySelector('#frame')!.innerHTML = `
<h2>Greetings</h2>
<div class="container">
  <div class="inner">Hello</div>
  <div class="inner">Goodbye</div>
</div>
`;
    });

    it('.append(html)', () => {
      const $container = $('.container');

      // 单个现有元素中添加html
      const $result = $container.append('<p>test</p>');
      assert.sameOrderedMembers(toClassNameArray($result), ['container']);

      const $children = $container.children();
      assert.sameOrderedMembers(toTagNameArray($children), ['div', 'div', 'p']);
    });

    it('.append(html)', () => {
      // 空元素中添加html
      document.querySelector('#frame')!.innerHTML = `
<div class="container">
  <div class="inner"></div>
  <div class="inner"></div>
</div>
`;

      $('.inner').append('<p>new1</p><span>new2</span>');

      const html = $('.container')[0].innerHTML;
      assert.equal(
        removeSpace(html),
        '<divclass="inner"><p>new1</p><span>new2</span></div><divclass="inner"><p>new1</p><span>new2</span></div>',
      );
    });

    it('.append(html, html)', () => {
      const $container = $('.container');

      // 单个元素中添加多个 html
      $container.append('<p>test1</p><p>test2</p>');

      const $children = $container.children();
      assert.sameOrderedMembers(toTextContentArray($children), [
        'Hello',
        'Goodbye',
        'test1',
        'test2',
      ]);
    });

    it('.append(text, html)', () => {
      const $container = $('.container');

      // 单个元素中添加多个纯文本和 html
      $container.append('plain-text', '<p>html</p>');

      assert.equal(
        removeSpace($container[0].textContent!),
        'HelloGoodbyeplain-texthtml',
      );
    });

    it('.apend(text)', () => {
      const $container = $('.container');

      // 单个元素中添加纯文本
      $container.append('text');

      assert.equal(removeSpace($container[0].textContent!), 'HelloGoodbyetext');
    });

    it('.append(text)', () => {
      // 新建元素，并添加一些元素，然后追加到现有元素中
      $('<p>test</p>').append(' new').appendTo('.container');

      const $children = $('.container').children();
      assert.sameOrderedMembers(toTagNameArray($children), ['div', 'div', 'p']);
      assert.sameOrderedMembers(toTextContentArray($children), [
        'Hello',
        'Goodbye',
        'test new',
      ]);
    });

    it('.append(text, html)', () => {
      // 多个元素中添加多个纯文本和html
      const $result = $('.inner').append('plain-text', '<p>html</p>');
      assert.sameOrderedMembers(toInnerHtmlArray($result), [
        'Helloplain-text<p>html</p>',
        'Goodbyeplain-text<p>html</p>',
      ]);

      const $children = $('.container').children();
      assert.sameOrderedMembers(toInnerHtmlArray($children), [
        'Helloplain-text<p>html</p>',
        'Goodbyeplain-text<p>html</p>',
      ]);
    });

    it('.append(element)', () => {
      // 单个元素中添加已有元素
      $('.container .inner:first-child').append($('#frame h2'));

      const $testChildren = $('#frame').children();
      const $containerChildren = $('.container').children();

      assert.sameOrderedMembers(toTagNameArray($testChildren), ['div']);
      assert.sameOrderedMembers(toTagNameArray($containerChildren), [
        'div',
        'div',
      ]);
      assert.sameOrderedMembers(toInnerHtmlArray($containerChildren), [
        'Hello<h2>Greetings</h2>',
        'Goodbye',
      ]);
    });

    it('.append(element, element)', () => {
      // 多个元素中添加已有元素
      document.querySelector('#frame')!.innerHTML = `
<h2>Greetings</h2>
<div class="container">
  <div class="inner">Hello</div>
  <div class="inner">Goodbye</div>
</div>
<span>test</span>
`;

      $('.container .inner').append($('#frame h2, #frame span'));

      const $testChildren = $('#frame').children();
      const $containerChildren = $('.container').children();

      assert.sameOrderedMembers(toTagNameArray($testChildren), ['div']);
      assert.sameOrderedMembers(toTagNameArray($containerChildren), [
        'div',
        'div',
      ]);
      assert.sameOrderedMembers(toInnerHtmlArray($containerChildren), [
        'Hello<h2>Greetings</h2><span>test</span>',
        'Goodbye<h2>Greetings</h2><span>test</span>',
      ]);
    });

    it('.append(tr)', () => {
      // 添加特殊元素
      document.querySelector('#frame')!.innerHTML = `
<table>
  <tbody>
  </tbody>
</table>
`;

      $('#frame tbody').append('<tr><td>11</td></tr>');

      assert.equal(
        removeSpace($('#frame')[0].innerHTML),
        '<table><tbody><tr><td>11</td></tr></tbody></table>',
      );
    });

    // 通过回调函数返回文本和html
    it('.append(callback)', () => {
      $('.inner').append(function (index, oldHtml) {
        return `${this.innerHTML}${index}<span>${oldHtml}</span>`;
      });

      assert.equal(
        removeSpace($('.container')[0].innerHTML),
        '<divclass="inner">HelloHello0<span>Hello</span></div><divclass="inner">GoodbyeGoodbye1<span>Goodbye</span></div>',
      );
    });
  });
};

test(jq, 'jq');
test(jQuery as unknown as JQStatic, 'jQuery');
