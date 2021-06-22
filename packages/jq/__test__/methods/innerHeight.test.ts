import { jQuery, jq, JQStatic } from '../utils.js';
import '../../methods/innerHeight.js';

const test = ($: JQStatic, type: string): void => {
  describe(`${type} - .innerHeight`, () => {
    // 已在 .width() 方法中测试
    it('.innerHeight()', () => {
      return '';
    });
  });
};

test(jq, 'jq');
test(jQuery as unknown as JQStatic, 'jQuery');
