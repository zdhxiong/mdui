import { jQuery, jq, JQStatic } from '../utils.js';
import '../../methods/height.js';

const test = ($: JQStatic, type: string): void => {
  describe(`${type} - .height`, () => {
    // 已在 .width() 方法中测试
    it('.height()', () => {
      return '';
    });
  });
};

test(jq, 'jq');
test(jQuery as unknown as JQStatic, 'jQuery');
