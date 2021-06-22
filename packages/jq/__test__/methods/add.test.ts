import { jQuery, jq, assert, JQStatic, toTagNameArray } from '../utils.js';
import '../../methods/add.js';

const test = ($: JQStatic, type: string): void => {
  describe(`${type} - .add`, () => {
    beforeEach(() => {
      document.querySelector('#frame')!.innerHTML = `
<ul>
  <li>list item 1</li>
  <li>list item 2</li>
</ul>
<p>a paragraph</p>
<div id="other-paragraph">other paragraph</div>
<span>inline text</span>
`;
    });

    it('.add(selector)', () => {
      let $selected = $('#frame li')
        .add('#frame p') // CSS 选择器
        .add(document.querySelector('#other-paragraph')) // HTMLElement
        .add($('#frame span')) // JQ 对象
        .add('<label>test</label>'); // HTML 字符串

      assert.sameOrderedMembers(toTagNameArray($selected), [
        'li',
        'li',
        'p',
        'div',
        'span',
        'label',
      ]);

      // 同一个元素不重复添加
      $selected = $selected.add('#frame p').add('#frame p');
      assert.lengthOf($selected, 6);
    });
  });
};

test(jq, 'jq');
test(jQuery as unknown as JQStatic, 'jQuery');
