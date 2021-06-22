import {
  jQuery,
  jq,
  assert,
  JQStatic,
  toTagNameArray,
  toTextContentArray,
} from '../utils.js';
import '../../methods/after.js';
import '../../methods/children.js';

const test = ($: JQStatic, type: string): void => {
  describe(`${type} - .after`, () => {
    // 和 before() 一样，省略大多数测试

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

    it('.after(html1, html2)', () => {
      const $result = $('.inner').after('<p>test1</p>', '<p>test2</p>');
      assert.sameOrderedMembers(toTagNameArray($result), ['div', 'div']);
      assert.sameOrderedMembers(toTextContentArray($result), [
        'Hello',
        'Goodbye',
      ]);

      const $children = $('.container').children();
      assert.sameOrderedMembers(toTagNameArray($children), [
        'h2',
        'div',
        'p',
        'p',
        'div',
        'p',
        'p',
      ]);
      assert.sameOrderedMembers(toTextContentArray($children), [
        'Greetings',
        'Hello',
        'test1',
        'test2',
        'Goodbye',
        'test1',
        'test2',
      ]);
    });
  });
};

test(jq, 'jq');
test(jQuery as unknown as JQStatic, 'jQuery');
