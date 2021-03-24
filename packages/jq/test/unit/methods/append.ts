import { assert } from 'chai';
import $ from '../../jq_or_jquery';
import {
  toClassNameArray,
  toTagNameArray,
  toInnerTextArray,
  removeSpace,
  toInnerHtmlArray,
} from '../../utils';

describe('.append()', function () {
  beforeEach(function () {
    $('#test').html(`
<h2>Greetings</h2>
<div class="container">
  <div class="inner">Hello</div>
  <div class="inner">Goodbye</div>
</div>
    `);
  });

  it('.append(html)', function () {
    // 单个现有元素中添加html
    const $result = $('.container').append('<p>test</p>');
    assert.sameOrderedMembers(toClassNameArray($result), ['container']);

    const $children = $('.container').children();
    assert.sameOrderedMembers(toTagNameArray($children), ['div', 'div', 'p']);
  });

  it('.append(html)', function () {
    // 空元素中添加html
    $('#test').html(`
<div class="container">
  <div class="inner"></div>
  <div class="inner"></div>
</div>
    `);

    $('.inner').append('<p>new1</p><span>new2</span>');

    const html = $('.container').html();
    assert.equal(
      removeSpace(html),
      '<divclass="inner"><p>new1</p><span>new2</span></div><divclass="inner"><p>new1</p><span>new2</span></div>',
    );
  });

  it('.append(html, html)', function () {
    // 单个元素中添加多个 html
    $('.container').append('<p>test1</p><p>test2</p>');

    const $children = $('.container').children();
    assert.sameOrderedMembers(toInnerTextArray($children), [
      'Hello',
      'Goodbye',
      'test1',
      'test2',
    ]);
  });

  it('.append(text, html)', function () {
    // 单个元素中添加多个纯文本和 html
    $('.container').append('plain-text', '<p>html</p>');

    assert.equal(
      removeSpace($('.container').text()),
      'HelloGoodbyeplain-texthtml',
    );
  });

  it('.apend(text)', function () {
    // 单个元素中添加纯文本
    $('.container').append('text');

    assert.equal(removeSpace($('.container').text()), 'HelloGoodbyetext');
  });

  it('.append(text)', function () {
    // 新建元素，并添加一些元素，然后追加到现有元素中
    $('<p>test</p>').append(' new').appendTo('.container');

    const $children = $('.container').children();
    assert.sameOrderedMembers(toTagNameArray($children), ['div', 'div', 'p']);
    assert.sameOrderedMembers(toInnerTextArray($children), [
      'Hello',
      'Goodbye',
      'test new',
    ]);
  });

  it('.append(text, html)', function () {
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

  it('.append(element)', function () {
    // 单个元素中添加已有元素
    $('.container .inner:first-child').append($('#test h2'));

    const $testChildren = $('#test').children();
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

  it('.append(element, element)', function () {
    // 多个元素中添加已有元素
    $('#test').html(`
<h2>Greetings</h2>
<div class="container">
  <div class="inner">Hello</div>
  <div class="inner">Goodbye</div>
</div>
<span>test</span>
    `);

    $('.container .inner').append($('#test h2, #test span'));

    const $testChildren = $('#test').children();
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

  it('.append(tr)', function () {
    // 添加特殊元素
    $('#test').html(`
<table>
  <tbody>
  </tbody>
</table>
    `);

    $('#test tbody').append('<tr><td>11</td></tr>');

    assert.equal(
      removeSpace($('#test').html()),
      '<table><tbody><tr><td>11</td></tr></tbody></table>',
    );
  });

  // 通过回调函数返回文本和html
  it('.append(callback)', function () {
    $('.inner').append(function (index, oldHtml) {
      return `${this.innerHTML}${index}<span>${oldHtml}</span>`;
    });

    assert.equal(
      removeSpace($('.container').html()),
      '<divclass="inner">HelloHello0<span>Hello</span></div><divclass="inner">GoodbyeGoodbye1<span>Goodbye</span></div>',
    );
  });
});
