import { assert } from 'chai';
import $ from '../../jq_or_jquery';
import { toTagNameArray, removeSpace, toInnerHtmlArray } from '../../utils';

describe('.appendTo()', function () {
  beforeEach(function () {
    $('#test').html(`
<h2>Greetings</h2>
<div class="container">
  <div class="inner">Hello</div>
  <div class="inner">Goodbye</div>
  <span class="test">test</span>
</div>
    `);
  });

  it('.appendTo(selector)', function () {
    // 创建新内容，插入到单个现有元素中
    const $result = $('<p>new</p>').appendTo('.inner:first-child');
    assert.sameOrderedMembers(toTagNameArray($result), ['p']);

    const html = $('.container .inner:first-child').html();
    assert.equal(html, 'Hello<p>new</p>');
  });

  it('.appendTo(empty_element)', function () {
    // 创建新元素，添加到一个空元素中
    $('#test').html(`
<div class="container">
  <div class="inner"></div>
  <div class="inner"></div>
</div>
    `);

    $('<p>new1</p><label>new2</label>').appendTo('.inner');

    const html = $('.container').html();
    assert.equal(
      removeSpace(html),
      '<divclass="inner"><p>new1</p><label>new2</label></div><divclass="inner"><p>new1</p><label>new2</label></div>',
    );
  });

  it('.appendTo(elements)', function () {
    // 创建新内容，插入到多个现有元素中
    const $result = $('<p>new</p>').appendTo('.inner');
    assert.sameOrderedMembers(toTagNameArray($result), ['p', 'p']);

    const html = $('.container').html();
    assert.equal(
      removeSpace(html),
      '<divclass="inner">Hello<p>new</p></div><divclass="inner">Goodbye<p>new</p></div><spanclass="test">test</span>',
    );
  });

  it('.appendTo(JQ)', function () {
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

    const html = $('.container').html();
    assert.equal(
      removeSpace(html),
      '<divclass="inner">Hello<p>new1</p><label>new2</label></div><divclass="inner">Goodbye<p>new1</p><label>new2</label></div><spanclass="test">test</span>',
    );
  });

  it('.appentTo(elements)', function () {
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

    const html = $('.container').html();
    assert.equal(
      removeSpace(html),
      '<divclass="inner">Hello<p>new1</p><label>new2</label><p>new1</p><label>new2</label></div><divclass="inner">Goodbye<p>new1</p><label>new2</label><p>new1</p><label>new2</label></div><spanclass="test">test</span>',
    );
  });

  it('.appentTo()', function () {
    // 选择现有元素，插入到现有元素中
    const $result = $('#test h2, #test .test').appendTo('#test .inner');
    assert.sameOrderedMembers(toTagNameArray($result), [
      'h2',
      'span',
      'h2',
      'span',
    ]);

    const html = $('#test').html();
    assert.equal(
      removeSpace(html),
      '<divclass="container"><divclass="inner">Hello<h2>Greetings</h2><spanclass="test">test</span></div><divclass="inner">Goodbye<h2>Greetings</h2><spanclass="test">test</span></div></div>',
    );
  });
});
