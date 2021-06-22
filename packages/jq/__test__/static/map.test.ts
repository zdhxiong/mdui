import { jQuery, jq, assert, JQStatic } from '../utils.js';
import '../../static/map.js';

const test = ($: JQStatic, type: string): void => {
  describe(`${type} - $.map`, () => {
    // 遍历数组
    it('$.map(array, callback)', () => {
      // 原样值
      const result1 = $.map(['J', 'S', 'L'], (val) => {
        return val;
      });
      assert.sameOrderedMembers(result1, ['J', 'S', 'L']);

      // 返回键名
      const result2 = $.map(['a', 'b', 'c'], (_, i) => {
        return i;
      });
      assert.sameOrderedMembers(result2, [0, 1, 2]);

      // 返回数组
      const result3 = $.map([1, 2, 3], (val) => {
        return [val, val + 1];
      });
      assert.sameOrderedMembers(result3, [1, 2, 2, 3, 3, 4]);

      // 返回 null 或 undefined
      const result4 = $.map([1, 2, 3, 4], (val) => {
        if (val === 2) return null;
        if (val === 3) return undefined;

        return val;
      });
      assert.sameOrderedMembers(result4, [1, 4]);

      // this 指向 window（jQuery 中严格模式下 this 为 undefined）
      if (type === 'jq') {
        $.map([1, 2, 3], function () {
          assert.instanceOf(this, Window);
        });
      }
    });

    // 遍历对象
    it('$.map(object, callback)', () => {
      // 返回值
      const result1 = $.map({ width: 1, height: 2 }, (val) => {
        return val + 2;
      });
      assert.sameOrderedMembers(result1, [3, 4]);

      // 返回键
      const result2 = $.map({ width: 1, height: 2 }, (_, i) => {
        return i;
      });
      assert.sameOrderedMembers(result2, ['width', 'height']);

      // 返回数组
      const result3 = $.map({ width: 1, height: 2 }, (val) => {
        return [val, val + 1];
      });
      assert.sameOrderedMembers(result3, [1, 2, 2, 3]);

      // 返回 null 或 undefined
      const result4 = $.map({ width: 1, height: 2, area: 3 }, (val) => {
        if (val === 1) return null;
        if (val === 2) return undefined;

        return val;
      });
      assert.sameOrderedMembers(result4, [3]);

      // this 指向 window（jQuery 中严格模式下 this 为 undefined）
      if (type === 'jq') {
        $.map({ width: 1, height: 2 }, function () {
          assert.instanceOf(this, Window);
        });
      }
    });
  });
};

test(jq, 'jq');
test(jQuery as unknown as JQStatic, 'jQuery');
