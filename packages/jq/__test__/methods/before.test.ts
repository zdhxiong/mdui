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
import '../../methods/before.js';
import '../../methods/children.js';
import '../../methods/add.js';

const test = ($: JQStatic, type: string): void => {
  describe(`${type} - .before`, () => {
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

    it('.before(html)', () => {
      // 单个元素前插入新元素
      const $result = $('.container h2').before('<p>test</p>');
      assert.sameOrderedMembers(toTagNameArray($result), ['h2']);

      const $children = $('.container').children();
      assert.sameOrderedMembers(toTagNameArray($children), [
        'p',
        'h2',
        'div',
        'div',
      ]);
    });

    it('.before(html1, html2)', () => {
      // 单个元素前插入多个新元素
      const $result = $('.container h2').before(
        '<span>test</span>',
        '<p>test</p>',
      );
      assert.sameOrderedMembers(toTagNameArray($result), ['h2']);

      const $children = $('.container').children();
      assert.sameOrderedMembers(toTagNameArray($children), [
        'span',
        'p',
        'h2',
        'div',
        'div',
      ]);
    });

    it('.before(html)', () => {
      // 多个元素前插入一个新元素
      const $result = $('.inner').before('<p>test</p>');
      assert.sameOrderedMembers(toClassNameArray($result), ['inner', 'inner']);

      const $children = $('.container').children();
      assert.sameOrderedMembers(toTagNameArray($children), [
        'h2',
        'p',
        'div',
        'p',
        'div',
      ]);
    });

    it('.before(html, html)', () => {
      // 多个元素前插入多个新元素
      const $result = $('.inner').before('<p>test</p>', '<span>test</span>');
      assert.sameOrderedMembers(toClassNameArray($result), ['inner', 'inner']);

      const $children = $('.container').children();
      assert.sameOrderedMembers(toTagNameArray($children), [
        'h2',
        'p',
        'span',
        'div',
        'p',
        'span',
        'div',
      ]);
    });

    it('.before(jq)', () => {
      // 一个元素前插入一个现有元素
      const $result = $('.container h2').before($('.inner:last-child'));
      assert.sameOrderedMembers(toTagNameArray($result), ['h2']);

      const $children = $('.container').children();
      assert.sameOrderedMembers(toTagNameArray($children), [
        'div',
        'h2',
        'div',
      ]);
    });

    it('.before(jq)', () => {
      // 一个元素前插入多个现有元素
      const $result = $('.container h2').before($('.inner'));
      assert.sameOrderedMembers(toTagNameArray($result), ['h2']);

      const $children = $('.container').children();
      assert.sameOrderedMembers(toTextContentArray($children), [
        'Hello',
        'Goodbye',
        'Greetings',
      ]);
    });

    it('.before(element, element)', () => {
      const $inner = $('.inner');

      // 一个元素前插入多个现有元素
      const $result = $('.container h2').before($inner[0], $inner[1]);
      assert.sameOrderedMembers(toTagNameArray($result), ['h2']);

      const $children = $('.container').children();
      assert.sameOrderedMembers(toTextContentArray($children), [
        'Hello',
        'Goodbye',
        'Greetings',
      ]);
    });

    it('.before(element, element)', () => {
      const $inner = $('.inner');

      // 多个元素前插入多个现有元素
      const $selector = $('.container h2').add('.other');
      const $result = $selector.before($inner[0], $inner[1]);
      assert.sameOrderedMembers(toTagNameArray($result), ['h2', 'div']);

      const $children = $('.container').children();
      assert.sameOrderedMembers(toTextContentArray($children), [
        'Hello',
        'Goodbye',
        'Greetings',
      ]);
      const $children2 = $('#frame').children();
      assert.sameOrderedMembers(toClassNameArray($children2), [
        'container',
        'inner',
        'inner',
        'other',
      ]);
    });

    it('.before(element, element)', () => {
      // 多个元素前插入多个现有元素
      // 另一个测试
      document.querySelector('#frame')!.innerHTML = `
<div class="container">
  <h2>Greetings</h2>
  <div class="inner">Hello</div>
  <div class="inner">Goodbye</div>
  <h2>test</h2>
</div>
<div class="other">other</div>
`;
      const $inner = $('.inner');
      const $selector = $('.container h2');
      const $result = $selector.before($inner[0], $inner[1]);
      assert.sameOrderedMembers(toTagNameArray($result), ['h2', 'h2']);

      const $children = $('.container').children();
      assert.sameOrderedMembers(toTextContentArray($children), [
        'Hello',
        'Goodbye',
        'Greetings',
        'Hello',
        'Goodbye',
        'test',
      ]);
    });

    it('.before(callback)', () => {
      // 单个元素前插入通过函数返回的 html 字符串
      const $result = $('.container h2').before(() => {
        return '<p>test</p>';
      });
      assert.sameOrderedMembers(toTagNameArray($result), ['h2']);

      const $children = $('.container').children();
      assert.sameOrderedMembers(toTagNameArray($children), [
        'p',
        'h2',
        'div',
        'div',
      ]);
    });

    it('.before(callback)', () => {
      // 单个元素前插入通过函数返回的单个元素
      const $container = $('.container');
      const $h2 = $('.container h2');

      // 新元素
      $h2.before(() => {
        return $('<p>test</p>');
      });

      let $children = $container.children();
      assert.sameOrderedMembers(toTagNameArray($children), [
        'p',
        'h2',
        'div',
        'div',
      ]);

      // 已有元素
      $h2.before(() => {
        return $('.container .inner:last-child');
      });

      $children = $container.children();
      assert.sameOrderedMembers(toTagNameArray($children), [
        'p',
        'div',
        'h2',
        'div',
      ]);
    });

    it('.before(callback)', () => {
      // 单个元素前插入通过函数返回的多个元素
      const $container = $('.container');

      // 新元素
      $('.container h2').before(() => {
        return $('<p>test</p><span>test</span>');
      });

      let $children = $container.children();
      assert.sameOrderedMembers(toTagNameArray($children), [
        'p',
        'span',
        'h2',
        'div',
        'div',
      ]);

      // 已有元素
      $('.container span').before(() => {
        return $('.container div');
      });
      $children = $container.children();
      assert.sameOrderedMembers(toTagNameArray($children), [
        'p',
        'div',
        'div',
        'span',
        'h2',
      ]);
    });

    it('.before(callback)', () => {
      // 多个元素前插入通过函数返回的 html 字符串
      $('.inner').before(() => {
        return $('<p>test</p><span>test</span>');
      });

      const $children = $('.container').children();
      assert.sameOrderedMembers(toTagNameArray($children), [
        'h2',
        'p',
        'span',
        'div',
        'p',
        'span',
        'div',
      ]);
    });

    it('.before(callback)', () => {
      // 多个元素前插入通过函数返回的单个元素
      const $container = $('.container');
      const $inner = $('.inner');

      // 新元素
      $inner.before(() => {
        return $('<p>test</p>');
      });

      let $children = $container.children();
      assert.sameOrderedMembers(toTagNameArray($children), [
        'h2',
        'p',
        'div',
        'p',
        'div',
      ]);

      // 已有元素
      $inner.before(() => {
        return $('.container h2');
      });
      $children = $container.children();
      assert.sameOrderedMembers(toTagNameArray($children), [
        'p',
        'div',
        'p',
        'h2',
        'div',
      ]);
    });

    it('.before(callback)', () => {
      // 多个元素前插入通过函数返回的多个元素
      const $container = $('.container');
      const $inner = $('.inner');

      // 新元素
      const _indexs: number[] = [];
      const _htmls: string[] = [];
      const _thisss: HTMLElement[] = [];
      $inner.before(function (index, html) {
        _thisss.push(this);
        _indexs.push(index);
        _htmls.push(html);

        return $('<p>test1</p><span>test2</span>');
      });
      assert.sameOrderedMembers(_indexs, [0, 1]);
      assert.sameOrderedMembers(_htmls, ['Hello', 'Goodbye']);
      assert.sameOrderedMembers(_thisss, $inner.get());

      let $children = $container.children();
      assert.sameOrderedMembers(toTagNameArray($children), [
        'h2',
        'p',
        'span',
        'div',
        'p',
        'span',
        'div',
      ]);

      // 已有元素
      $inner.before(() => {
        return $('.container span');
      });
      $children = $container.children();
      assert.sameOrderedMembers(toTagNameArray($children), [
        'h2',
        'p',
        'div',
        'p',
        'span',
        'span',
        'div',
      ]);
    });

    it('.before(text)', () => {
      // 插入文本
      $('.inner').before('test');

      const text = $('.container')[0].textContent!;
      assert.equal(removeSpace(text), 'GreetingstestHellotestGoodbye');
    });

    it('.before(text_callback)', () => {
      // 通过回调函数插入文本
      $('.inner').before((index, html) => {
        return html + index + 'new';
      });

      const text = $('.container')[0].textContent!;
      assert.equal(
        removeSpace(text),
        'GreetingsHello0newHelloGoodbye1newGoodbye',
      );
    });

    it('.before(tr)', () => {
      // 插入特殊元素
      document.querySelector('#frame')!.innerHTML = `
<table>
  <tbody>
    <tr class="second"></tr>
  </tbody>
</table>
`;

      $('#frame .second').before('<tr class="first"></tr>');
      assert.equal(
        removeSpace($('#frame')[0].innerHTML),
        '<table><tbody><trclass="first"></tr><trclass="second"></tr></tbody></table>',
      );
    });
  });
};

test(jq, 'jq');
test(jQuery as unknown as JQStatic, 'jQuery');
