import { assert } from 'chai';
import $ from '../../jq_or_jquery';

describe('$.each', function () {
  it('$.each(array, callback)', function () {
    const arr = ['a', 'b'];
    const testObj: any[] = [];
    const result = $.each(arr, function (i, item) {
      testObj.push({
        key: i,
        value: item,
        _this: this.toString(),
      });
    });

    assert.sameOrderedMembers(result as any[], arr);
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
  it('$.each(array, callback)', function () {
    const arr = ['a', 'b'];
    const testObj: any[] = [];
    const result = $.each(arr, function (i, item) {
      testObj.push({
        key: i,
        value: item,
        _this: this.toString(),
      });

      return false;
    });

    assert.sameOrderedMembers(result as any[], arr);
    assert.sameDeepOrderedMembers(testObj, [
      {
        key: 0,
        value: 'a',
        _this: 'a',
      },
    ]);
  });

  it('$.each(object, callback)', function () {
    const obj = { a: 'ww', b: 'mdui' };
    const testObj: any[] = [];
    const result = $.each(obj, function (i, item) {
      testObj.push({
        key: i,
        value: item,
        _this: this.toString(),
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
  it('$.each(object, callback)', function () {
    const obj = { a: 'ww', b: 'mdui' };
    const testObj: any[] = [];
    const result = $.each(obj, function (i, item) {
      testObj.push({
        key: i,
        value: item,
        _this: this.toString(),
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
