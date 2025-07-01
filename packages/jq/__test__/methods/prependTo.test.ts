import '../../methods/prependTo.js';
import { jQuery, jq, JQStatic } from '../utils.js';

const test = (_$: JQStatic, type: string): void => {
  describe(`${type} - .prependTo`, () => {
    it('.prependTo(JQSelector): JQ', () => {
      // 该方法直接调用 .prepend() 实现，.prepend() 通过即可
    });
  });
};

test(jq, 'jq');
test(jQuery as unknown as JQStatic, 'jQuery');
