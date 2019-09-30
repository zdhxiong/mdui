import $ from '../../jq_or_jquery';
import { toInnerHtmlArray } from '../../utils';

describe('.prepend()', function() {
  // append 中已做了测试，这里不多做测试

  beforeEach(function() {
    $('#test').html(`
<h2>Greetings</h2>
<div class="container">
  <div class="inner">Hello</div>
  <div class="inner">Goodbye</div>
</div>
    `);
  });

  it('.prepend(text, html)', function() {
    // 多个元素中添加多个纯文本和html
    const $result = $('.inner').prepend('plain-text', '<p>html</p>');
    chai.assert.sameOrderedMembers(toInnerHtmlArray($result), [
      'plain-text<p>html</p>Hello',
      'plain-text<p>html</p>Goodbye',
    ]);

    const $children = $('.container').children();
    chai.assert.sameOrderedMembers(toInnerHtmlArray($children), [
      'plain-text<p>html</p>Hello',
      'plain-text<p>html</p>Goodbye',
    ]);
  });
});
