import $ from '../../jq_or_jquery';
import {
  toTagNameArray,
  toClassNameArray,
  toInnerTextArray,
  removeSpace,
} from '../../utils';

describe('.before()', function() {
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

  it('.before(html)', function() {
    // 单个元素前插入新元素
    const $result = $('.container h2').before('<p>test</p>');
    chai.assert.sameOrderedMembers(toTagNameArray($result), ['h2']);

    const $children = $('.container').children();
    chai.assert.sameOrderedMembers(toTagNameArray($children), [
      'p',
      'h2',
      'div',
      'div',
    ]);
  });

  it('.before(html1, html2)', function() {
    // 单个元素前插入多个新元素
    const $result = $('.container h2').before(
      '<span>test</span>',
      '<p>test</p>',
    );
    chai.assert.sameOrderedMembers(toTagNameArray($result), ['h2']);

    const $children = $('.container').children();
    chai.assert.sameOrderedMembers(toTagNameArray($children), [
      'span',
      'p',
      'h2',
      'div',
      'div',
    ]);
  });

  it('.before(html)', function() {
    // 多个元素前插入一个新元素
    const $result = $('.inner').before('<p>test</p>');
    chai.assert.sameOrderedMembers(toClassNameArray($result), [
      'inner',
      'inner',
    ]);

    const $children = $('.container').children();
    chai.assert.sameOrderedMembers(toTagNameArray($children), [
      'h2',
      'p',
      'div',
      'p',
      'div',
    ]);
  });

  it('.before(html, html)', function() {
    // 多个元素前插入多个新元素
    const $result = $('.inner').before('<p>test</p>', '<span>test</span>');
    chai.assert.sameOrderedMembers(toClassNameArray($result), [
      'inner',
      'inner',
    ]);

    const $children = $('.container').children();
    chai.assert.sameOrderedMembers(toTagNameArray($children), [
      'h2',
      'p',
      'span',
      'div',
      'p',
      'span',
      'div',
    ]);
  });

  it('.before(jq)', function() {
    // 一个元素前插入一个现有元素
    const $result = $('.container h2').before($('.inner:last-child'));
    chai.assert.sameOrderedMembers(toTagNameArray($result), ['h2']);

    const $children = $('.container').children();
    chai.assert.sameOrderedMembers(toTagNameArray($children), [
      'div',
      'h2',
      'div',
    ]);
  });

  it('.before(jq)', function() {
    // 一个元素前插入多个现有元素
    const $result = $('.container h2').before($('.inner'));
    chai.assert.sameOrderedMembers(toTagNameArray($result), ['h2']);

    const $children = $('.container').children();
    chai.assert.sameOrderedMembers(toInnerTextArray($children), [
      'Hello',
      'Goodbye',
      'Greetings',
    ]);
  });

  it('.before(element, element)', function() {
    // 一个元素前插入多个现有元素
    const $result = $('.container h2').before($('.inner')[0], $('.inner')[1]);
    chai.assert.sameOrderedMembers(toTagNameArray($result), ['h2']);

    const $children = $('.container').children();
    chai.assert.sameOrderedMembers(toInnerTextArray($children), [
      'Hello',
      'Goodbye',
      'Greetings',
    ]);
  });

  it('.before(element, element)', function() {
    // 多个元素前插入多个现有元素
    const $selector = $('.container h2').add('.other');
    const $result = $selector.before($('.inner')[0], $('.inner')[1]);
    chai.assert.sameOrderedMembers(toTagNameArray($result), ['h2', 'div']);

    const $children = $('.container').children();
    chai.assert.sameOrderedMembers(toInnerTextArray($children), [
      'Hello',
      'Goodbye',
      'Greetings',
    ]);
    const $children2 = $('#test').children();
    chai.assert.sameOrderedMembers(toClassNameArray($children2), [
      'container',
      'inner',
      'inner',
      'other',
    ]);
  });

  it('.before(element, element)', function() {
    // 多个元素前插入多个现有元素
    // 另一个测试
    $('#test').html(`
<div class="container">
  <h2>Greetings</h2>
  <div class="inner">Hello</div>
  <div class="inner">Goodbye</div>
  <h2>test</h2>
</div>
<div class="other">other</div>
    `);
    const $selector = $('.container h2');
    const $result = $selector.before($('.inner')[0], $('.inner')[1]);
    chai.assert.sameOrderedMembers(toTagNameArray($result), ['h2', 'h2']);

    const $children = $('.container').children();
    chai.assert.sameOrderedMembers(toInnerTextArray($children), [
      'Hello',
      'Goodbye',
      'Greetings',
      'Hello',
      'Goodbye',
      'test',
    ]);
  });

  it('.before(callback)', function() {
    // 单个元素前插入通过函数返回的 html 字符串
    const $result = $('.container h2').before(function() {
      return '<p>test</p>';
    });
    chai.assert.sameOrderedMembers(toTagNameArray($result), ['h2']);

    const $children = $('.container').children();
    chai.assert.sameOrderedMembers(toTagNameArray($children), [
      'p',
      'h2',
      'div',
      'div',
    ]);
  });

  it('.before(callback)', function() {
    // 单个元素前插入通过函数返回的单个元素

    // 新元素
    $('.container h2').before(function() {
      return $('<p>test</p>');
    });

    let $children = $('.container').children();
    chai.assert.sameOrderedMembers(toTagNameArray($children), [
      'p',
      'h2',
      'div',
      'div',
    ]);

    // 已有元素
    $('.container h2').before(function() {
      return $('.container .inner:last-child');
    });

    $children = $('.container').children();
    chai.assert.sameOrderedMembers(toTagNameArray($children), [
      'p',
      'div',
      'h2',
      'div',
    ]);
  });

  it('.before(callback)', function() {
    // 单个元素前插入通过函数返回的多个元素

    // 新元素
    $('.container h2').before(function() {
      return $('<p>test</p><span>test</span>');
    });

    let $children = $('.container').children();
    chai.assert.sameOrderedMembers(toTagNameArray($children), [
      'p',
      'span',
      'h2',
      'div',
      'div',
    ]);

    // 已有元素
    $('.container span').before(function() {
      return $('.container div');
    });
    $children = $('.container').children();
    chai.assert.sameOrderedMembers(toTagNameArray($children), [
      'p',
      'div',
      'div',
      'span',
      'h2',
    ]);
  });

  it('.before(callback)', function() {
    // 多个元素前插入通过函数返回的 html 字符串
    $('.inner').before(function() {
      return $('<p>test</p><span>test</span>');
    });

    const $children = $('.container').children();
    chai.assert.sameOrderedMembers(toTagNameArray($children), [
      'h2',
      'p',
      'span',
      'div',
      'p',
      'span',
      'div',
    ]);
  });

  it('.before(callback)', function() {
    // 多个元素前插入通过函数返回的单个元素

    // 新元素
    $('.inner').before(function() {
      return $('<p>test</p>');
    });

    let $children = $('.container').children();
    chai.assert.sameOrderedMembers(toTagNameArray($children), [
      'h2',
      'p',
      'div',
      'p',
      'div',
    ]);

    // 已有元素
    $('.inner').before(function() {
      return $('.container h2');
    });
    $children = $('.container').children();
    chai.assert.sameOrderedMembers(toTagNameArray($children), [
      'p',
      'div',
      'p',
      'h2',
      'div',
    ]);
  });

  it('.before(callback)', function() {
    // 多个元素前插入通过函数返回的多个元素

    // 新元素
    const _indexs: number[] = [];
    const _htmls: string[] = [];
    const _thisss: HTMLElement[] = [];
    $('.inner').before(function(index, html) {
      _thisss.push(this);
      _indexs.push(index);
      _htmls.push(html);

      return $('<p>test1</p><span>test2</span>');
    });
    chai.assert.sameOrderedMembers(_indexs, [0, 1]);
    chai.assert.sameOrderedMembers(_htmls, ['Hello', 'Goodbye']);
    chai.assert.sameOrderedMembers(_thisss, $('.inner').get());

    let $children = $('.container').children();
    chai.assert.sameOrderedMembers(toTagNameArray($children), [
      'h2',
      'p',
      'span',
      'div',
      'p',
      'span',
      'div',
    ]);

    // 已有元素
    $('.inner').before(function() {
      return $('.container span');
    });
    $children = $('.container').children();
    chai.assert.sameOrderedMembers(toTagNameArray($children), [
      'h2',
      'p',
      'div',
      'p',
      'span',
      'span',
      'div',
    ]);
  });

  it('.before(text)', function() {
    // 插入文本
    $('.inner').before('test');

    const text = $('.container').text();

    chai.assert.equal(removeSpace(text), 'GreetingstestHellotestGoodbye');
  });

  it('.before(text_callback)', function() {
    // 通过回调函数插入文本
    $('.inner').before(function(index, html) {
      return html + index + 'new';
    });

    const text = $('.container').text();
    chai.assert.equal(
      removeSpace(text),
      'GreetingsHello0newHelloGoodbye1newGoodbye',
    );
  });

  it('.before(tr)', function() {
    // 插入特殊元素
    $('#test').html(`
<table>
  <tbody>
    <tr class="second"></tr>
  </tbody>
</table>
    `);

    $('#test .second').before('<tr class="first"></tr>');
    chai.assert.equal(
      removeSpace($('#test').html()),
      '<table><tbody><trclass="first"></tr><trclass="second"></tr></tbody></table>',
    );
  });
});
