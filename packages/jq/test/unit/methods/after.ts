import $ from '../../jq_or_jquery';
import { toTagNameArray, toInnerTextArray } from '../../utils';

describe('.after()', function() {
  // 和 before() 一样，省略大多数测试

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

  it('.after(html1, html2)', function() {
    const $result = $('.inner').after('<p>test1</p>', '<p>test2</p>');
    chai.assert.sameOrderedMembers(toTagNameArray($result), ['div', 'div']);
    chai.assert.sameOrderedMembers(toInnerTextArray($result), [
      'Hello',
      'Goodbye',
    ]);

    const $children = $('.container').children();
    chai.assert.sameOrderedMembers(toTagNameArray($children), [
      'h2',
      'div',
      'p',
      'p',
      'div',
      'p',
      'p',
    ]);
    chai.assert.sameOrderedMembers(toInnerTextArray($children), [
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
