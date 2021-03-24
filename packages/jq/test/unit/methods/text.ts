import { assert } from 'chai';
import $ from '../../jq_or_jquery';

describe('.text()', function () {
  beforeEach(function () {
    $('#test').html(`
<div id="div">
  <div class="box">Box</div>
  <ul>
    <li>item 1</li>
    <li>item 2</li>
  </ul>
</div>
    `);
  });

  it('.text()', function () {
    const $div = $('#div');

    assert.equal($div.find('.box').text(), 'Box');

    // 包含后代元素
    assert.equal($div.text(), '\n  Box\n  \n    item 1\n    item 2\n  \n');

    // text() 将获取集合中所有元素的文本
    assert.equal($div.find('li').text(), 'item 1item 2');

    // 空集合
    assert.equal($('#notfound').text(), '');

    // $(window).text() 返回空字符串
    assert.equal($(window).text(), '');

    // $(document).text() 返回包括 head 和 body 合并后的内容
    assert.isNotEmpty($(document).text());
  });

  it('.text(content)', function () {
    const $box = $('#div .box');
    const $lis = $('#div li');

    const $boxResult = $box.text('<p>This is a test.</p>');
    assert.deepEqual($boxResult, $box);
    assert.equal($box.html(), '&lt;p&gt;This is a test.&lt;/p&gt;');

    $box.text(1234);
    assert.equal($box.text(), '1234');

    $box.text(true);
    assert.equal($box.text(), 'true');

    $box.text(undefined);
    assert.equal($box.text(), 'true');

    $lis.text('new li');
    assert.equal($lis.eq(0).text(), 'new li');
    assert.equal($lis.eq(1).text(), 'new li');
    assert.equal($lis.text(), 'new linew li');
  });

  it('.text(callback)', function () {
    const $box = $('#div .box');
    const $lis = $('#div li');

    const _thiss: HTMLElement[] = [];
    const _indexs: number[] = [];
    const _oldValues: string[] = [];

    const $lisResult = $lis.text(function (index, oldValue) {
      _thiss.push(this);
      _indexs.push(index);
      _oldValues.push(oldValue);

      return oldValue + index;
    });

    assert.deepEqual($lisResult, $lis);
    assert.sameOrderedMembers(_thiss, $lis.get());
    assert.sameOrderedMembers(_indexs, [0, 1]);
    assert.sameOrderedMembers(_oldValues, ['item 1', 'item 2']);
    assert.equal($lis.text(), 'item 10item 21');

    $box.text(function () {
      return undefined;
    });
    assert.equal($box.text(), 'Box');

    $box.text(function () {
      // 不返回
    });
    assert.equal($box.text(), 'Box');
  });
});
