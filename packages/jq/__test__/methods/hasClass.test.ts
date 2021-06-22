import { jQuery, jq, assert, JQStatic } from '../utils.js';
import '../../methods/hasClass.js';

const test = ($: JQStatic, type: string): void => {
  describe(`${type} - .hasClass`, () => {
    beforeEach(() => {
      document.querySelector('#frame')!.innerHTML = `
<div class="mdui mdui2">Goodbye</div>
`;
    });

    it('.hasClass(string): boolean', () => {
      const $div = $('#frame div');
      assert.isTrue($div.hasClass('mdui'));
      assert.isFalse($div.hasClass('test'));
    });
  });
};

test(jq, 'jq');
test(jQuery as unknown as JQStatic, 'jQuery');
