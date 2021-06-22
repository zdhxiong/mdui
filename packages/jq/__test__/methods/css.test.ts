import { jQuery, jq, assert, JQStatic } from '../utils.js';
import '../../methods/css.js';

const test = ($: JQStatic, type: string): void => {
  describe(`${type} - .css`, () => {
    beforeEach(() => {
      document.querySelector('#frame')!.innerHTML = `
<div id="div" style="width: 100px;font-size: 20px;height: 100px;"></div>
`;
    });

    // 设置元素的样式
    it('.css(name, value)', () => {
      const $div = $('#div');

      const $divResult = $div
        .css('width', '200px')
        .css('line-height', '20px')
        .css('font-size', undefined)
        .css('height', 50)
        .css('opacity', 0.6);

      assert.deepEqual($divResult, $div);
      assert.equal($div.css('width'), '200px');
      assert.equal($div.css('line-height'), '20px');
      assert.equal($div.css('font-size'), '20px');
      assert.equal($div.css('height'), '50px');
      // webkit 中读取 opacity 时，获取到的是 0.6000000238418579
      assert.equal(Number($div.css('opacity').substr(0, 5)), 0.6);
    });

    // 通过回调函数设置元素的样式
    it('.css(name, callback)', () => {
      const $div = $('#div');

      const cbThis: HTMLElement[] = [];
      const cbIndex: number[] = [];
      const cbOldValue: string[] = [];

      const $divResult = $div
        .css('width', function (index, oldValue) {
          cbThis.push(this);
          cbIndex.push(index);
          cbOldValue.push(oldValue);

          return;
        })
        .css('line-height', () => {
          return '20px';
        })
        .css('font-size', () => {
          return undefined;
        })
        .css('height', () => {
          return 50;
        })
        .css('opacity', () => {
          return 0.6;
        });

      assert.deepEqual($divResult, $div);
      assert.sameOrderedMembers(cbThis, [$div[0]]);
      assert.sameOrderedMembers(cbIndex, [0]);
      assert.sameOrderedMembers(cbOldValue, ['100px']);
      assert.equal($div.css('width'), '100px');
      assert.equal($div.css('line-height'), '20px');
      assert.equal($div.css('font-size'), '20px');
      assert.equal($div.css('height'), '50px');
      // webkit 中读取 opacity 时，获取到的是 0.6000000238418579
      assert.equal(Number($div.css('opacity').substr(0, 5)), 0.6);
    });

    // 同时设置多个样式
    it('.css(object)', () => {
      const $div = $('#div');

      const $divResult = $div.css({
        width: '200px',
        lineHeight: '20px',
        fontSize: undefined,
        height: 50,
        opacity: 0.6,
      });

      assert.deepEqual($divResult, $div);
      assert.equal($div.css('width'), '200px');
      assert.equal($div.css('line-height'), '20px');
      assert.equal($div.css('font-size'), '20px');
      assert.equal($div.css('height'), '50px');
      // webkit 中读取 opacity 时，获取到的是 0.6000000238418579
      assert.equal(Number($div.css('opacity').substr(0, 5)), 0.6);
    });

    // 通过回调函数同时设置多个样式
    it('.css(object)', () => {
      const $div = $('#div');

      const cbThis: HTMLElement[] = [];
      const cbIndex: number[] = [];
      const cbOldValue: string[] = [];

      const $divResult = $div.css({
        width: function (index, oldValue) {
          cbThis.push(this);
          cbIndex.push(index);
          cbOldValue.push(oldValue);

          return;
        },
        'line-height': () => {
          return '20px';
        },
        'font-size': () => {
          return undefined;
        },
        height: () => {
          return 50;
        },
        opacity: () => {
          return 0.6;
        },
      });

      assert.deepEqual($divResult, $div);
      assert.sameOrderedMembers(cbThis, [$div[0]]);
      assert.sameOrderedMembers(cbIndex, [0]);
      assert.sameOrderedMembers(cbOldValue, ['100px']);
      assert.equal($div.css('width'), '100px');
      assert.equal($div.css('line-height'), '20px');
      assert.equal($div.css('font-size'), '20px');
      assert.equal($div.css('height'), '50px');
      // webkit 中读取 opacity 时，获取到的是 0.6000000238418579
      assert.equal(Number($div.css('opacity').substr(0, 5)), 0.6);
    });

    // 获取第一个元素的样式
    it('.css(name)', () => {
      const $div = $('#div');

      assert.equal($div.css('width'), '100px');
      assert.equal($div.css('font-size'), '20px');
      assert.equal($div.css('display'), 'block');
    });
  });
};

test(jq, 'jq');
test(jQuery as unknown as JQStatic, 'jQuery');
