import { jQuery, jq, assert, JQStatic } from '../utils.js';
import '../../static/each.js';

const test = ($: JQStatic, type: string): void => {
  describe(`${type} - $.each`, () => {
    it('$.each(array, callback)', () => {
      const arr = ['a', 'b'];
      const testObj: unknown[] = [];
      const result = $.each(arr, function (i, item) {
        testObj.push({
          key: i,
          value: item,
          _this: this,
        });
      });

      assert.sameOrderedMembers(result as unknown[], arr);
      assert.sameDeepOrderedMembers(testObj, [
        {
          key: 0,
          value: 'a',
          _this: 'a',
        },
        {
          key: 1,
          value: 'b',
          _this: 'b',
        },
      ]);
    });

    // 返回 false 停止遍历
    it('$.each(array, callback)', () => {
      const arr = ['a', 'b'];
      const testObj: unknown[] = [];
      const result = $.each(arr, function (i, item) {
        testObj.push({
          key: i,
          value: item,
          _this: this,
        });

        return false;
      });

      assert.sameOrderedMembers(result as unknown[], arr);
      assert.sameDeepOrderedMembers(testObj, [
        {
          key: 0,
          value: 'a',
          _this: 'a',
        },
      ]);
    });

    it('$.each(object, callback)', () => {
      const obj = { a: 'ww', b: 'mdui' };
      const testObj: unknown[] = [];
      const result = $.each(obj, function (i, item) {
        testObj.push({
          key: i,
          value: item,
          _this: this,
        });
      });

      assert.deepEqual(result, obj);
      assert.sameDeepOrderedMembers(testObj, [
        {
          key: 'a',
          value: 'ww',
          _this: 'ww',
        },
        {
          key: 'b',
          value: 'mdui',
          _this: 'mdui',
        },
      ]);
    });

    // 返回 false 停止遍历
    it('$.each(object, callback)', () => {
      const obj = { a: 'ww', b: 'mdui' };
      const testObj: unknown[] = [];
      const result = $.each(obj, function (i, item) {
        testObj.push({
          key: i,
          value: item,
          _this: this,
        });

        return false;
      });

      assert.deepEqual(result, obj);
      assert.sameDeepOrderedMembers(testObj, [
        {
          key: 'a',
          value: 'ww',
          _this: 'ww',
        },
      ]);
    });
  });
};

test(jq, 'jq');
test(jQuery as unknown as JQStatic, 'jQuery');
