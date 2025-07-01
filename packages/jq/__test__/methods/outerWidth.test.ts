import '../../methods/outerWidth.js';
import { jQuery, jq, JQStatic } from '../utils.js';

const test = (_$: JQStatic, type: string): void => {
  describe(`${type} - .outerWidth`, () => {
    // 已在 .width() 方法中测试
    it('.outerWidth()', () => {
      return '';
    });
  });
};

test(jq, 'jq');
test(jQuery as unknown as JQStatic, 'jQuery');
