import { jQuery, jq, assert, JQStatic } from '../utils.js';
import '../../static/contains.js';

const test = ($: JQStatic, type: string): void => {
  describe(`${type} - $.contains`, () => {
    before(() => {
      document.querySelector('#frame')!.innerHTML = `
<div id="child">
  <span></span>
</div>
`;
    });

    it('$.contains(parent, child)', () => {
      assert.isTrue($.contains(document.documentElement, document.body));
      assert.isTrue($.contains(document, document.body));
      assert.isFalse($.contains(document.body, document.documentElement));
      assert.isFalse($.contains(document.body, document));
      assert.isFalse(
        $.contains(document.getElementById('frame'), document.documentElement),
      );
      assert.isTrue(
        $.contains(document.documentElement, document.getElementById('frame')),
      );
      assert.isTrue(
        $.contains(
          document.getElementById('frame'),
          document.getElementById('child'),
        ),
      );
      assert.isFalse(
        $.contains(
          document.getElementById('child'),
          document.getElementById('frame'),
        ),
      );
    });
  });
};

test(jq, 'jq');
test(jQuery as unknown as JQStatic, 'jQuery');
