import '../../static/extend.js';
import { jQuery, jq, assert, JQStatic } from '../utils.js';

const test = ($: JQStatic, type: string): void => {
  describe(`${type} - $.extend`, () => {
    it('$.extend(obj)', () => {
      let _this;
      const merged = $.extend({
        testFunc: function () {
          // eslint-disable-next-line @typescript-eslint/no-this-alias
          _this = this;
          return 'testFunc';
        },
        testFunc2: () => {
          return 'testFunc2';
        },
      });

      assert.deepEqual(merged, $);
      // @ts-ignore
      assert.equal($.testFunc(), 'testFunc');
      // @ts-ignore
      assert.equal($.testFunc2(), 'testFunc2');
      assert.deepEqual(_this, merged); // this 指向 $
    });

    it('$.extend(obj1, obj2, ...)', () => {
      const obj1 = { key: 'val' };
      const obj2 = { key1: 'val1' };
      const obj3 = { key2: 'val2', key3: undefined, key4: null }; // 值为 undefined 不合并
      const expected = {
        key: 'val',
        key1: 'val1',
        key2: 'val2',
        key4: null,
      };
      const result = $.extend(obj1, obj2, obj3);

      assert.deepEqual(obj1, expected);
      assert.deepEqual(result, expected);
    });
  });
};

test(jq, 'jq');
test(jQuery as unknown as JQStatic, 'jQuery');
