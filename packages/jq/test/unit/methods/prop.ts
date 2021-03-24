import { assert } from 'chai';
import $ from '../../jq_or_jquery';

describe('.prop()', function () {
  beforeEach(function () {
    $('#test').html(`
<input id="checkbox" type="checkbox" draggable="true"/>
    `);
  });

  // 设置元素的属性
  it('.prop(name, value)', function () {
    const $checkbox = $('#checkbox');

    const $checkboxResult = $checkbox
      .prop('tabindex', 2)
      .prop('checked', true)
      .prop('draggable', undefined)
      .prop('hidden', null);

    assert.deepEqual($checkboxResult, $checkbox);
    assert.equal($checkbox.prop('tabindex'), 2);
    assert.isTrue($checkbox.prop('checked'));
    assert.isTrue($checkbox.prop('draggable'));
    assert.isFalse($checkbox.prop('hidden'));
    assert.isUndefined($checkbox.prop('notfound'));
  });

  // 通过回调函数设置元素的属性
  it('.prop(name, callback)', function () {
    const $checkbox = $('#checkbox');

    const cbThis: HTMLElement[] = [];
    const cbIndex: number[] = [];
    const cbOldValue: any[] = [];

    const $checkboxResult = $checkbox
      .prop('tabindex', function () {
        return 2;
      })
      .prop('checked', function (index, oldValue) {
        cbThis.push(this);
        cbIndex.push(index);
        cbOldValue.push(oldValue);

        return true;
      })
      .prop('draggable', function () {
        return undefined;
      })
      .prop('disabled', function () {
        return;
      });

    assert.deepEqual($checkboxResult, $checkbox);
    assert.sameOrderedMembers(cbThis, [$checkbox[0]]);
    assert.sameOrderedMembers(cbIndex, [0]);
    assert.sameOrderedMembers(cbOldValue, [false]);
    assert.equal($checkbox.prop('tabindex'), 2);
    assert.isTrue($checkbox.prop('checked'));
    assert.isTrue($checkbox.prop('draggable'));
    assert.isFalse($checkbox.prop('disabled'));
    assert.isUndefined($checkbox.prop('notfound'));
  });

  // 同时设置多个属性
  it('.prop(object)', function () {
    const $checkbox = $('#checkbox');

    const $checkboxResult = $checkbox.prop({
      tabindex: 2,
      checked: true,
      draggable: undefined,
    });

    assert.deepEqual($checkboxResult, $checkbox);
    assert.equal($checkbox.prop('tabindex'), 2);
    assert.isTrue($checkbox.prop('checked'));
    assert.isTrue($checkbox.prop('draggable'));
    assert.isFalse($checkbox.prop('disabled'));
    assert.isUndefined($checkbox.prop('notfound'));
  });

  // 通过回调函数同时设置多个元素的值
  it('.prop(object)', function () {
    const $checkbox = $('#checkbox');

    const cbThis: HTMLElement[] = [];
    const cbIndex: number[] = [];
    const cbOldValue: any[] = [];

    const $checkboxResult = $checkbox.prop({
      tabindex: function () {
        return 2;
      },
      checked: function (index, oldValue) {
        cbThis.push(this);
        cbIndex.push(index);
        cbOldValue.push(oldValue);

        return true;
      },
      draggable: function () {
        return undefined;
      },
      disabled: function () {
        return;
      },
    });

    assert.deepEqual($checkboxResult, $checkbox);
    assert.sameOrderedMembers(cbThis, [$checkbox[0]]);
    assert.sameOrderedMembers(cbIndex, [0]);
    assert.sameOrderedMembers(cbOldValue, [false]);
    assert.equal($checkbox.prop('tabindex'), 2);
    assert.isTrue($checkbox.prop('checked'));
    assert.isTrue($checkbox.prop('draggable'));
    assert.isFalse($checkbox.prop('disabled'));
    assert.isUndefined($checkbox.prop('notfound'));
  });

  // 获取第一个元素的属性值
  it('.prop(name)', function () {
    const $checkbox = $('#checkbox');

    assert.isTrue($checkbox.prop('draggable'));
    assert.isFalse($checkbox.prop('checked'));
  });
});
