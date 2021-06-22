import { jQuery, jq, assert, JQStatic } from '../utils.js';
import '../../methods/offsetParent.js';
import '../../methods/get.js';

const test = ($: JQStatic, type: string): void => {
  describe(`${type} - .offsetParent`, () => {
    beforeEach(() => {
      document.querySelector('#frame')!.innerHTML = `
<ul class="level-1">
  <li class="item-ii" style="position: relative;">II
    <ul class="level-2">
      <li class="item-a">A</li>
    </ul>
  </li>
  <li class="item-ii" style="position: relative;">II
    <ul class="level-2">
      <li class="item-a">A</li>
    </ul>
  </li>
</ul>
`;
    });

    it('.offsetParent()', () => {
      assert.sameOrderedMembers(
        $('.item-a').offsetParent().get(),
        $('.item-ii').get(),
      );
    });
  });
};

test(jq, 'jq');
test(jQuery as unknown as JQStatic, 'jQuery');
