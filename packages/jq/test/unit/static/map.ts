import $ from '../../jq_or_jquery';

describe('$.map', function() {
  // 遍历数组
  it('$.map(array, callback)', function() {
    // 原样值
    const result1 = $.map(['J', 'S', 'L'], function(val) {
      return val;
    });
    chai.assert.sameOrderedMembers(result1, ['J', 'S', 'L']);

    // 返回键名
    const result2 = $.map(['a', 'b', 'c'], function(_, i) {
      return i;
    });
    chai.assert.sameOrderedMembers(result2, [0, 1, 2]);

    // 返回数组
    const result3 = $.map([1, 2, 3], function(val) {
      return [val, val + 1];
    });
    chai.assert.sameOrderedMembers(result3, [1, 2, 2, 3, 3, 4]);

    // 返回 null 或 undefined
    const result4 = $.map([1, 2, 3, 4], function(val) {
      if (val === 2) return null;
      if (val === 3) return undefined;

      return val;
    });
    chai.assert.sameOrderedMembers(result4, [1, 4]);

    // this 指向 window（jQuery 的 this 没有按文档所写的指向 window）
    /* $.map([1, 2, 3], function() {
      chai.assert.instanceOf(this, Window);
    }); */
  });

  // 遍历对象
  it('$.map(object, callback)', function() {
    // 返回值
    const result1 = $.map({ width: 1, height: 2 }, function(val) {
      return val + 2;
    });
    chai.assert.sameOrderedMembers(result1, [3, 4]);

    // 返回键
    const result2 = $.map({ width: 1, height: 2 }, function(_, i) {
      return i;
    });
    chai.assert.sameOrderedMembers(result2, ['width', 'height']);

    // 返回数组
    const result3 = $.map({ width: 1, height: 2 }, function(val) {
      return [val, val + 1];
    });
    chai.assert.sameOrderedMembers(result3, [1, 2, 2, 3]);

    // 返回 null 或 undefined
    const result4 = $.map({ width: 1, height: 2, area: 3 }, function(val) {
      if (val === 1) return null;
      if (val === 2) return undefined;

      return val;
    });
    chai.assert.sameOrderedMembers(result4, [3]);

    // this 指向 window（jQuery 的 this 没有按文档所写的指向 window）
    /* $.map({ width: 1, height: 2 }, function() {
      chai.assert.instanceOf(this, Window);
    }); */
  });
});
