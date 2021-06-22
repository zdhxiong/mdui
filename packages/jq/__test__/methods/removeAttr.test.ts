import { jQuery, jq, assert, JQStatic } from '../utils.js';
import '../../methods/removeAttr.js';
import '../../methods/attr.js';

const test = ($: JQStatic, type: string): void => {
  describe(`${type} - .removeAttr`, () => {
    beforeEach(() => {
      document.querySelector('#frame')!.innerHTML = `
<div id="div" mdui="test" title="hello" label="world" name="mdui"></div>
`;
    });

    it('.removeAttr(name)', () => {
      const $div = $('#div');

      assert.equal($div.attr('mdui'), 'test');
      const $divResult = $div.removeAttr('mdui');
      assert.deepEqual($divResult, $div);
      assert.isUndefined($div.attr('mdui'));

      assert.equal($div.attr('title'), 'hello');
      $div.removeAttr('title');
      assert.isUndefined($div.attr('title'));
    });

    it('.removeAttr(names)', () => {
      const $div = $('#div');

      $div.removeAttr('mdui title   name');
      assert.isUndefined($div.attr('mdui'));
      assert.isUndefined($div.attr('title'));
      assert.isUndefined($div.attr('name'));
      assert.equal($div.attr('label'), 'world');
    });
  });
};

test(jq, 'jq');
test(jQuery as unknown as JQStatic, 'jQuery');
