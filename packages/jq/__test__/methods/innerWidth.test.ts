import '../../methods/innerWidth.js';
import { jQuery, jq, JQStatic } from '../utils.js';

const test = (_$: JQStatic, type: string): void => {
  describe(`${type} - .innerWidth`, () => {
    // 已在 .width() 方法中测试
    it('.innerWidth()', () => {
      return '';
    });
  });
};

test(jq, 'jq');
test(jQuery as unknown as JQStatic, 'jQuery');
