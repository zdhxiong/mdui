import '../../methods/add.js';
import '../../methods/attr.js';
import { jQuery, jq, assert, JQStatic } from '../utils.js';

const test = ($: JQStatic, type: string): void => {
  describe(`${type} - $.each`, () => {
    beforeEach(() => {
      document.querySelector('#frame')!.innerHTML = `
<div id="div" mdui="test" title="hello" label="world" meta="hhh" hello="no"></div>
<input id="checkbox" type="checkbox" checked="checked" hello="noo"/>
`;
    });

    // 设置元素的属性
    it('.attr(name, value)', () => {
      const $div = $('#div');
      const $checkbox = $('#checkbox');

      const $divResult = $div
        .attr('mdui', 'value')
        .attr('max', 99)
        .attr('title', null)
        .attr('label', undefined);

      assert.deepEqual($divResult, $div);
      assert.equal($div.attr('mdui'), 'value');
      assert.equal($div.attr('max'), '99');
      assert.isUndefined($div.attr('title'));
      assert.equal($div.attr('label'), 'world');
      assert.isUndefined($div.attr('notfound'));

      $div.add($checkbox).attr('hello', 'world');
      assert.equal($div.attr('hello'), 'world');
      assert.equal($checkbox.attr('hello'), 'world');
    });

    // 通过回调函数设置元素的属性
    it('.attr(name, callback)', () => {
      const $div = $('#div');
      const $checkbox = $('#checkbox');

      const cbThis: HTMLElement[] = [];
      const cbIndex: number[] = [];
      const cbOldValue: string[] = [];

      const $divResult = $div
        .attr('mdui', function (_, oldValue) {
          return oldValue + ' value';
        })
        .attr('min', function () {
          return 11;
        })
        .attr('meta', function () {
          return null;
        })
        .attr('title', function () {
          return;
        })
        .attr('label', function (index, oldValue) {
          cbThis.push(this);
          cbIndex.push(index);
          cbOldValue.push(oldValue);

          return undefined;
        });

      assert.deepEqual($divResult, $div);
      assert.sameOrderedMembers(cbThis, [$divResult[0]]);
      assert.sameOrderedMembers(cbIndex, [0]);
      assert.sameOrderedMembers(cbOldValue, ['world']);
      assert.equal($div.attr('mdui'), 'test value');
      assert.equal($div.attr('min'), '11');
      assert.isUndefined($div.attr('meta'));
      assert.equal($div.attr('title'), 'hello');
      assert.equal($div.attr('label'), 'world');
      assert.isUndefined($div.attr('notfound'));

      $div.add($checkbox).attr('hello', (_, oldAttr) => {
        return oldAttr + 'world';
      });
      assert.equal($div.attr('hello'), 'noworld');
      assert.equal($checkbox.attr('hello'), 'nooworld');
    });

    // 同时设置多个属性
    it('.attr(object)', () => {
      const $div = $('#div');
      const $divResult = $div.attr({
        mdui: 'value',
        max: 99,
        title: null,
      });

      assert.deepEqual($divResult, $div);
      assert.equal($div.attr('mdui'), 'value');
      assert.equal($div.attr('max'), '99');
      assert.isUndefined($div.attr('title'));
      assert.isUndefined($div.attr('notfound'));
    });

    // 通过回调函数同时设置多个元素的值
    it('.attr(object)', () => {
      const $div = $('#div');

      const cbThis: HTMLElement[] = [];
      const cbIndex: number[] = [];
      const cbOldValue: string[] = [];

      const $divResult = $div.attr({
        mdui: (_, oldValue) => {
          return oldValue + ' value';
        },
        min: () => {
          return 11;
        },
        meta: () => {
          return null;
        },
        title: () => {
          return;
        },
        label: function (index, oldValue) {
          cbThis.push(this);
          cbIndex.push(index);
          cbOldValue.push(oldValue);

          return undefined;
        },
      });

      assert.deepEqual($divResult, $div);
      assert.sameOrderedMembers(cbThis, [$divResult[0]]);
      assert.sameOrderedMembers(cbIndex, [0]);
      assert.sameOrderedMembers(cbOldValue, ['world']);
      assert.equal($div.attr('mdui'), 'test value');
      assert.equal($div.attr('min'), '11');
      assert.isUndefined($div.attr('meta'));
      assert.equal($div.attr('title'), 'hello');
      assert.equal($div.attr('label'), 'world');
      assert.isUndefined($div.attr('notfound'));
    });

    // 获取第一个元素的属性值
    it('.attr(name)', () => {
      const $div = $('#div');
      const $checkbox = $('#checkbox');

      assert.equal($div.attr('mdui'), 'test');
      assert.equal($checkbox.attr('checked'), 'checked');
    });
  });
};

test(jq, 'jq');
test(jQuery as unknown as JQStatic, 'jQuery');
