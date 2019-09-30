import $ from '../../jq_or_jquery';
import { toTagNameArray } from '../../utils';

describe('.add()', function() {
  beforeEach(function() {
    $('#test').html(`
<ul>
  <li>list item 1</li>
  <li>list item 2</li>
</ul>
<p>a paragraph</p>
<div id="other-paragraph">other paragraph</div>
<span>inline text</span>
`);
  });

  it('.add(selector)', function() {
    let $selected = $('#test li')
      .add('#test p') // CSS 选择器
      .add(document.getElementById('other-paragraph')) // HTMLElement
      .add($('#test span')) // JQ 对象
      .add('<label>test</label>') // HTML 字符串
      .css('background-color', 'red');
    chai.assert.sameOrderedMembers(toTagNameArray($selected), [
      'li',
      'li',
      'p',
      'div',
      'span',
      'label',
    ]);

    $selected.each(function() {
      chai.assert.equal(this.style.backgroundColor, 'red');
    });

    // 同一个元素不重复添加
    $selected = $selected.add('#test p').add('#test p');
    chai.assert.lengthOf($selected, 6);
  });
});
