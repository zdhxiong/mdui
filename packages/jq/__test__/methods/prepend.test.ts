import '../../methods/children.js';
import '../../methods/prepend.js';
import { jQuery, jq, assert, JQStatic, toInnerHtmlArray } from '../utils.js';

const test = ($: JQStatic, type: string): void => {
  describe(`${type} - .prepend`, () => {
    // append 中已做了测试，这里不多做测试

    beforeEach(() => {
      document.querySelector('#frame')!.innerHTML = `
<h2>Greetings</h2>
<div class="container">
  <div class="inner">Hello</div>
  <div class="inner">Goodbye</div>
</div>
`;
    });

    it('.prepend(text, html)', () => {
      // 多个元素中添加多个纯文本和html
      const $result = $('.inner').prepend('plain-text', '<p>html</p>');
      assert.sameOrderedMembers(toInnerHtmlArray($result), [
        'plain-text<p>html</p>Hello',
        'plain-text<p>html</p>Goodbye',
      ]);

      const $children = $('.container').children();
      assert.sameOrderedMembers(toInnerHtmlArray($children), [
        'plain-text<p>html</p>Hello',
        'plain-text<p>html</p>Goodbye',
      ]);
    });
  });
};

test(jq, 'jq');
test(jQuery as unknown as JQStatic, 'jQuery');
