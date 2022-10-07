import '../../methods/prop.js';
import '../../methods/removeProp.js';
import { jQuery, jq, assert, JQStatic } from '../utils.js';

const test = ($: JQStatic, type: string): void => {
  describe(`${type} - .removeProp`, () => {
    beforeEach(() => {
      document.querySelector('#frame')!.innerHTML = `
<input id="checkbox" type="checkbox" checked/>
`;
    });

    it('.removeProp(name)', () => {
      const $checkbox = $('#checkbox');

      $checkbox.prop('mmmm', 'nnnn');
      assert.equal($checkbox.prop('mmmm'), 'nnnn');
      $checkbox.removeProp('mmmm');
      assert.isUndefined($checkbox.prop('mmmm'));

      // 不能用 removeProp 删除内置属性
      assert.isTrue($checkbox.prop('checked'));
      $checkbox.removeProp('checked');
      assert.isTrue($checkbox.prop('checked'));
    });
  });
};

test(jq, 'jq');
test(jQuery as unknown as JQStatic, 'jQuery');
