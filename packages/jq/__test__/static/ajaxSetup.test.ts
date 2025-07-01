import '../../static/ajaxSetup.js';
import { jQuery, jq, JQStatic } from '../utils.js';

const test = (_$: JQStatic, type: string): void => {
  describe(`${type} - $.ajaxSetup`, () => {
    it('$.ajaxSetup(options)', () => {
      // 直接使用 $.extend 方法合并，就不写测试了
    });
  });
};

test(jq, 'jq');
test(jQuery as unknown as JQStatic, 'jQuery');
