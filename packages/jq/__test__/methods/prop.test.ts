import { jQuery, jq, assert, JQStatic } from '../utils.js';
import '../../methods/prop.js';

const test = ($: JQStatic, type: string): void => {
  describe(`${type} - .prop`, () => {
    beforeEach(() => {
      document.querySelector('#frame')!.innerHTML = `
<input id="checkbox" type="checkbox" draggable="true"/>
`;
    });

    // 设置元素的属性
    it('.prop(name, value)', () => {
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
    it('.prop(name, callback)', () => {
      const $checkbox = $('#checkbox');

      const cbThis: HTMLElement[] = [];
      const cbIndex: number[] = [];
      const cbOldValue: unknown[] = [];

      const $checkboxResult = $checkbox
        .prop('tabindex', () => {
          return 2;
        })
        .prop('checked', function (index, oldValue) {
          cbThis.push(this);
          cbIndex.push(index);
          cbOldValue.push(oldValue);

          return true;
        })
        .prop('draggable', () => {
          return undefined;
        })
        .prop('disabled', () => {
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
    it('.prop(object)', () => {
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
    it('.prop(object)', () => {
      const $checkbox = $('#checkbox');

      const cbThis: HTMLElement[] = [];
      const cbIndex: number[] = [];
      const cbOldValue: unknown[] = [];

      const $checkboxResult = $checkbox.prop({
        tabindex: () => {
          return 2;
        },
        checked: function (index, oldValue) {
          cbThis.push(this);
          cbIndex.push(index);
          cbOldValue.push(oldValue);

          return true;
        },
        draggable: () => {
          return undefined;
        },
        disabled: () => {
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
    it('.prop(name)', () => {
      const $checkbox = $('#checkbox');

      assert.isTrue($checkbox.prop('draggable'));
      assert.isFalse($checkbox.prop('checked'));
    });
  });
};

test(jq, 'jq');
test(jQuery as unknown as JQStatic, 'jQuery');
