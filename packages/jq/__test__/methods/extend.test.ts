import { jQuery, jq, assert, JQStatic, JQ } from '../utils.js';
import '../../methods/extend.js';

const test = ($: JQStatic, type: string): void => {
  describe(`${type} - .extend`, () => {
    beforeEach(() => {
      document.querySelector('#frame')!.innerHTML = `
<div class="test1"></div>
<div class="test2"></div>
`;
    });

    it('.extend(object): JQ', () => {
      $.fn.extend({
        testFunc1: function (this: JQ) {
          this[0].classList.add('class1');
        },
        testFunc2: function (this: JQ) {
          this[0].classList.add('class2');
        },
      });

      const $test1 = $('.test1');
      const $test2 = $('.test2');
      // @ts-ignore
      $test1.testFunc1();
      // @ts-ignore
      $test2.testFunc2();

      assert.isTrue($test1[0].classList.contains('class1'));
      assert.isTrue($test2[0].classList.contains('class2'));
    });
  });
};

test(jq, 'jq');
test(jQuery as unknown as JQStatic, 'jQuery');
