import { jQuery, jq, assert, JQStatic } from '../utils.js';
import '../../methods/clone.js';
import '../../methods/appendTo.js';
import '../../methods/children.js';

const test = ($: JQStatic, type: string): void => {
  describe(`${type} - .clone`, () => {
    beforeEach(() => {
      document.querySelector('#frame')!.innerHTML = `
<div class="container">
  <div class="hello">Hello</div>
  <div class="goodbye">
    <span>Goodbye</span>
  </div>
</div>
`;
    });

    it('.clone()', () => {
      $('.hello').clone().appendTo('.goodbye');

      assert.lengthOf($('.container').children('.hello'), 1);
      const $goodbyeChildren = $('.goodbye').children();
      assert.lengthOf($goodbyeChildren, 2);
      assert.equal($goodbyeChildren[0].innerHTML, 'Goodbye');
      assert.equal($goodbyeChildren[1].innerHTML, 'Hello');

      assert.throw($(window).clone);
    });
  });
};

test(jq, 'jq');
test(jQuery as unknown as JQStatic, 'jQuery');
