import { assert } from 'chai';
import $ from '../../jq_or_jquery';

describe('.html()', function () {
  beforeEach(function () {
    $('#test').html(`
<div id="div">
  <div class="box">Box</div>
  <span class="span">Span</span>
  <ul>
    <li><span>item 1</span></li>
    <li><span>item 2</span></li>
  </ul>
</div>
    `);
  });

  it('.html()', function () {
    const $div = $('#div');

    assert.equal($div.find('.box').html(), 'Box');

    // 仅获取第一个元素
    assert.equal($div.find('li').html(), '<span>item 1</span>');

    // 空集合
    assert.isUndefined($('#notfound').html());

    // $(window).html() jquery 会报错，不测试。

    // $(document).html() jquery 会报错，不测试。
  });

  it('.html(content)', function () {
    const $box = $('#div .box');
    const $lis = $('#div li');

    const $boxResult = $box.html('<p>All new content. <em>You bet!</em></p>');
    assert.deepEqual($boxResult, $box);
    assert.equal($box.html(), '<p>All new content. <em>You bet!</em></p>');

    $box.html(undefined);
    assert.equal($box.html(), '<p>All new content. <em>You bet!</em></p>');

    $lis.html('<p>new li</p>');
    assert.equal($lis.eq(0).html(), '<p>new li</p>');
    assert.equal($lis.eq(1).html(), '<p>new li</p>');
    assert.equal($lis.html(), '<p>new li</p>');
  });

  it('.html(element)', function () {
    const $span = $('#div .span');
    const $lis = $('#div li');

    $lis.html($span[0]);
    assert.equal($lis.eq(0).html(), '<span class="span">Span</span>');
    assert.equal($lis.eq(1).html(), '<span class="span">Span</span>');
  });

  it('.html(callback)', function () {
    const $box = $('#div .box');
    const $lis = $('#div li');

    const _thisss: HTMLElement[] = [];
    const _indexs: number[] = [];
    const _oldValues: string[] = [];

    const $lisResult = $lis.html(function (index, oldValue) {
      _thisss.push(this);
      _indexs.push(index);
      _oldValues.push(oldValue);

      return `${oldValue}<label>${index}</label>`;
    });

    assert.deepEqual($lisResult, $lis);
    assert.sameOrderedMembers(_thisss, $lis.get());
    assert.sameOrderedMembers(_indexs, [0, 1]);
    assert.sameOrderedMembers(_oldValues, [
      '<span>item 1</span>',
      '<span>item 2</span>',
    ]);
    assert.equal($lis.html(), '<span>item 1</span><label>0</label>');
    assert.equal($lis.eq(0).html(), '<span>item 1</span><label>0</label>');
    assert.equal($lis.eq(1).html(), '<span>item 2</span><label>1</label>');

    $box.html(function () {
      return undefined;
    });
    assert.equal($box.html(), 'Box');

    $box.html(function () {
      // 不返回
    });
    assert.equal($box.html(), 'Box');
  });
});
