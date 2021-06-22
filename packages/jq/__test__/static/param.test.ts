import { jQuery, jq, assert, JQStatic } from '../utils.js';
import '../../static/param.js';

const test = ($: JQStatic, type: string): void => {
  describe(`${type} - $.param`, () => {
    it('$.param(error params)', () => {
      // @ts-ignore
      assert.equal($.param(null), '');
      // @ts-ignore
      assert.equal($.param(undefined), '');
      // 其他参数如 window, document 在 jQuery 中会直接报错
    });

    it('$.param(object)', () => {
      assert.equal(
        $.param({ width: 1680, height: '1050' }),
        'width=1680&height=1050',
      );
      assert.equal(
        $.param({
          width: 100,
          null: null,
          undefined: undefined,
          true: true,
          false: false,
        }),
        'width=100&null=&undefined=&true=true&false=false',
      );
      assert.equal(
        decodeURIComponent($.param({ foo: { one: 1, two: 2 } })),
        'foo[one]=1&foo[two]=2',
      );
      assert.equal(
        decodeURIComponent(
          $.param({ ids: ['a1', 'b2', 'c3'], c: { g: 23, e: [567] }, a: 3 }),
        ),
        'ids[]=a1&ids[]=b2&ids[]=c3&c[g]=23&c[e][]=567&a=3',
      );
      assert.equal(
        decodeURIComponent($.param({ ids: [1, 2, 3] })),
        'ids[]=1&ids[]=2&ids[]=3',
      );
      assert.equal(
        decodeURIComponent($.param({ a: 'a+b', b: 'b c' })),
        'a=a+b&b=b c',
      );
    });

    it('$.param(array)', () => {
      assert.equal(
        $.param([
          { name: 'key1', value: 'val1' },
          { name: 'key2', value: 'val2' },
        ]),
        'key1=val1&key2=val2',
      );
    });
  });
};

test(jq, 'jq');
test(jQuery as unknown as JQStatic, 'jQuery');
