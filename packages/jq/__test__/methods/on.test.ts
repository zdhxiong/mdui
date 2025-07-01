import '../../methods/on.js';
import '../../methods/trigger.js';
import { jQuery, jq, assert, JQStatic } from '../utils.js';

const test = ($: JQStatic, type: string): void => {
  describe(`${type} - .on`, () => {
    const isJquery = type === 'jQuery';

    let eventCount = 0;
    const callback = () => {
      eventCount++;
    };
    const callback2 = () => {
      eventCount = eventCount + 2;
    };

    beforeEach(() => {
      // 每次都移除元素，并重新创建，确保原有事件全部移除
      document.querySelector('#frame')!.innerHTML = `
<div id="inner"><button id="button"></button></div>
`;
    });

    it('.on(type, fn)', () => {
      const $inner = $('#inner');
      eventCount = 0;

      $inner.on('click', function () {
        // this 指向触发事件的元素
        assert.deepEqual($inner[0], this);
        eventCount++;
      });
      $inner.trigger('click');
      assert.equal(eventCount, 1);

      $inner.off('click');
      $inner.trigger('click');
      assert.equal(eventCount, 1);
    });

    it('.on(muliple_type, fn)', () => {
      const $inner = $('#inner');
      eventCount = 0;

      $inner.on('click input customEvent', callback);
      $inner.trigger('click');
      assert.equal(eventCount, 1);
      $inner.trigger('input');
      assert.equal(eventCount, 2);
      $inner.trigger('customEvent');
      assert.equal(eventCount, 3);

      $inner.off('input');
      $inner.trigger('click');
      assert.equal(eventCount, 4);
      $inner.trigger('input');
      assert.equal(eventCount, 4);
      $inner.trigger('customEvent');
      assert.equal(eventCount, 5);

      $inner.off('click customEvent');
      $inner.trigger('click');
      $inner.trigger('input');
      $inner.trigger('customEvent');
      assert.equal(eventCount, 5);
    });

    it('.trigger(type, data)', () => {
      const $inner = $('#inner');
      eventCount = 0;

      $inner.on(
        'click input change dbclick customEvent',
        function (event, data, data2) {
          assert.isTrue(
            ['click', 'input', 'change', 'dbclick', 'customEvent'].indexOf(
              event.type,
            ) > -1,
          );

          switch (event.type) {
            case 'click':
              eventCount++;
              assert.equal(data, 'click-data');
              if (!isJquery) {
                assert.equal(event.detail, 'click-data');
              }
              break;

            case 'input':
              eventCount++;
              assert.deepEqual(data, { key: 'val' });
              if (!isJquery) {
                assert.deepEqual(event.detail, { key: 'val' });
              }
              break;

            case 'change':
              eventCount++;
              assert.deepEqual(data, 22);
              if (!isJquery) {
                assert.deepEqual(event.detail, 22);
              }
              break;

            case 'dbclick':
              eventCount++;
              assert.isTrue(data);
              if (!isJquery) {
                assert.isTrue(event.detail);
              }
              break;

            case 'customEvent':
              eventCount++;
              assert.equal(data, 'custom-data');
              assert.equal(data2, 'custom-value');
              if (!isJquery) {
                // @ts-ignore
                assert.sameOrderedMembers(event.detail, [
                  'custom-data',
                  'custom-value',
                ]);
              }
              break;
          }
        },
      );

      $inner.trigger('click', 'click-data');
      $inner.trigger('input', { key: 'val' });
      $inner.trigger('change', 22);
      $inner.trigger('dbclick', true);
      $inner.trigger('customEvent', ['custom-data', 'custom-value']);

      assert.equal(eventCount, 5);
    });

    it('.on(type, data, fn)', () => {
      const $inner = $('#inner');
      eventCount = 0;

      $inner.on('input', true, function (event) {
        eventCount++;
        assert.isTrue(event.data);
      });

      $inner.on('change', { key: 'val' }, function (event) {
        eventCount++;
        assert.deepEqual(event.data, {
          key: 'val',
        });
      });

      // 若 data 为字符串参数时，必须指定 selector 参数
      $inner.on('click', undefined, 'test-val', function (event) {
        eventCount++;
        assert.equal(event.data, 'test-val');
      });

      $inner.on('dbclick', null, 'test-val', function (event) {
        eventCount++;
        assert.equal(event.data, 'test-val');
      });

      $inner.trigger('input');
      $inner.trigger('change');
      $inner.trigger('click');
      $inner.trigger('dbclick');

      assert.equal(eventCount, 4);
    });

    it('.on(type, selector, fn)', () => {
      const $inner = $('#inner');
      const $button = $('#button');
      eventCount = 0;

      $inner.on('click', '#button', function (event, data1, data2) {
        eventCount++;
        assert.deepEqual($button[0], this);
        assert.deepEqual(event.target, $button[0]);
        assert.equal(data1, 'data1');
        assert.equal(data2, 'data2');
      });

      $button.trigger('click', ['data1', 'data2']);
      $button.trigger('input');

      assert.equal(eventCount, 1);
    });

    it('.on(type, selector, data, fn)', () => {
      const $inner = $('#inner');
      const $button = $('#button');
      eventCount = 0;

      $inner.on('click', '#button', 'test-data', function (event) {
        eventCount++;
        assert.deepEqual(event.target, $button[0]);
        assert.equal(event.data, 'test-data');
      });

      $inner.on('click', '#button', 33, function (event) {
        eventCount++;
        assert.deepEqual(event.target, $button[0]);
        assert.deepEqual(event.data, 33);
      });

      $button.trigger('click');

      assert.equal(eventCount, 2);
    });

    it('.on(object)', () => {
      const $inner = $('#inner');
      eventCount = 0;

      $inner.on({
        click: function () {
          eventCount++;
          assert.deepEqual($inner[0], this);
        },
        input: callback2,
        customEvent: callback,
      });

      $inner.trigger('click');
      assert.equal(eventCount, 1);
      $inner.trigger('input');
      assert.equal(eventCount, 3);
      $inner.trigger('customEvent');
      assert.equal(eventCount, 4);
    });

    it('.on(object, data)', () => {
      const $inner = $('#inner');
      eventCount = 0;

      $inner.on(
        {
          click: function (event, data) {
            eventCount++;
            assert.equal(data, 'data');
            assert.equal(event.type, 'click');
            assert.equal(event.data, 'test-data');
          },
          input: function (event, data1, data2) {
            eventCount++;
            assert.equal(data1, 'data1');
            assert.equal(data2, 'data2');
            assert.equal(event.type, 'input');
            assert.equal(event.data, 'test-data');
          },
        },
        null,
        'test-data', // data 为字符串时，必须指定 selector
      );

      $inner.trigger('click', 'data');
      assert.equal(eventCount, 1);

      $inner.trigger('input', ['data1', 'data2']);
      assert.equal(eventCount, 2);

      $inner.on(
        {
          change: function () {
            eventCount++;
          },
        },
        { key: 'val' },
      );
      $inner.trigger('change');
      assert.equal(eventCount, 3);
    });

    it('.on(object, selector)', () => {
      const $inner = $('#inner');
      const $button = $('#button');
      eventCount = 0;

      $inner.on(
        {
          click: function (event, data) {
            eventCount++;
            assert.deepEqual($button[0], this);
            assert.isUndefined(data);
            assert.equal(event.type, 'click');
            assert.isUndefined(event.data);
            if (!isJquery) {
              assert.isNull(event.detail);
            }
          },
          change: function (event, data) {
            eventCount++;
            assert.deepEqual($button[0], this);
            assert.equal(data, 'val');
            assert.equal(event.type, 'change');
            assert.isUndefined(event.data);
            if (!isJquery) {
              assert.equal(event.detail, 'val');
            }
          },
        },
        '#button',
      );

      $button.trigger('click');
      assert.equal(eventCount, 1);

      $button.trigger('change', 'val');
      assert.equal(eventCount, 2);

      $inner.on(
        {
          input: callback,
          dbclick: callback2,
        },
        null,
      );

      $inner.trigger('input');
      assert.equal(eventCount, 3);

      $inner.trigger('dbclick');
      assert.equal(eventCount, 5);
    });

    it('.on(object, selector, data)', () => {
      const $inner = $('#inner');
      const $button = $('#button');
      eventCount = 0;

      $inner.on(
        {
          click: function (event, data) {
            eventCount++;
            assert.isUndefined(data);
            assert.equal(event.data, 'test-data');
            if (!isJquery) {
              assert.isNull(event.detail);
            }
          },
          change: function (event, data1, data2) {
            eventCount++;
            assert.equal(data1, 'data1');
            assert.equal(data2, 'data2');
            assert.equal(event.data, 'test-data');
            if (!isJquery) {
              // @ts-ignore
              assert.sameOrderedMembers(event.detail, ['data1', 'data2']);
            }
          },
        },
        '#button',
        'test-data',
      );

      $button.trigger('click');
      assert.equal(eventCount, 1);

      $button.trigger('change', ['data1', 'data2']);
      assert.equal(eventCount, 2);
    });

    it('.on(type, false)', () => {
      const $test = $('#frame');

      // 点击 a 链接时，默认会跳转；事件的回调函数返回 false，则不会跳转
      $test[0].innerHTML = `<a id="link" href="https://mdui.org">mdui</a>`;

      const $link = $('#link');

      $link.on('click', false);
      $link.trigger('click');
      $link.off('click');

      $link.on('click', function () {
        return false;
      });
      $link.trigger('click');
      $link.off('click');

      $link.on('click', null, 'test-data', false);
      $link.trigger('click');
      $link.off('click');

      $link.on('click', { key: 'val' }, false);
      $link.trigger('click');
      $link.off('click');

      $test.on('click', '#link', false);
      $link.trigger('click');
      $link.off('click');

      $test.on('click', '#link', function () {
        return false;
      });
      $link.trigger('click');
      $link.off('click');

      $test.on('click', '#link', 'test-data', false);
      $link.trigger('click');
      $link.off('click');

      $test.on('click', '#link', 'test-data', function () {
        return false;
      });
      $link.trigger('click');
      $link.off('click');

      $link.on({
        click: false,
      });
      $link.trigger('click');
      $link.off('click');

      $link.on({
        click: function () {
          return false;
        },
      });
      $link.trigger('click');
      $link.off('click');

      $link.on(
        {
          click: false,
        },
        null,
        'test-data',
      );
      $link.trigger('click');
      $link.off('click');

      $link.on(
        {
          click: function () {
            return false;
          },
        },
        { key: 'val' },
      );
      $link.trigger('click');
      $link.off('click');

      $test.on(
        {
          click: false,
        },
        '#link',
      );
      $link.trigger('click');
      $link.off('click');

      $test.on(
        {
          click: function () {
            return false;
          },
        },
        '#link',
      );
      $link.trigger('click');
      $link.off('click');

      $test.on(
        {
          click: false,
        },
        '#link',
        'test-data',
      );
      $link.trigger('click');
      $link.off('click');

      $test.on(
        {
          click: function () {
            return false;
          },
        },
        '#link',
        { key: 'val' },
      );
      $link.trigger('click');
      $link.off('click');
    });

    it('.off()', () => {
      const $inner = $('#inner');
      const $button = $('#button');
      eventCount = 0;

      $inner.on('click', callback);
      $inner.on('input', callback2);
      $inner.off();
      $inner.trigger('click');
      $inner.trigger('input');
      assert.equal(eventCount, 0);

      $inner.on('click', callback);
      $inner.on('input', callback2);
      $inner.off('click');
      $inner.trigger('click');
      $inner.trigger('input');
      assert.equal(eventCount, 2);
      $inner.off();

      $inner.on('click', callback);
      $inner.on('click', callback2);
      $inner.off('click', callback2);
      $inner.trigger('click');
      assert.equal(eventCount, 3);
      $inner.off();

      $inner.on('click', '#button', callback);
      $inner.on('input', '#button', callback2);
      $inner.off('click', '#button');
      $button.trigger('click');
      $button.trigger('input');
      assert.equal(eventCount, 5);
      $inner.off();

      $inner.on('click', '#button', callback);
      $inner.on('click', '#button', callback2);
      $inner.off('click', '#button', callback2);
      $button.trigger('click');
      assert.equal(eventCount, 6);
      $inner.off();

      $inner.on('click', callback);
      $inner.on('click', callback2);
      $inner.on('input', callback);
      $inner.on('input', callback2);
      $inner.off({
        click: callback2,
        input: callback,
      });
      $inner.trigger('click');
      $inner.trigger('input');
      assert.equal(eventCount, 9);
      $inner.off();

      $inner.on('click', '#button', callback);
      $inner.on('click', '#button', callback2);
      $inner.on('input', '#button', callback);
      $inner.on('input', '#button', callback2);
      $inner.off(
        {
          click: callback2,
          input: callback,
        },
        '#button',
      );
      $button.trigger('click');
      $button.trigger('input');
      assert.equal(eventCount, 12);
      $inner.off();
    });

    it('.on(namespace)', () => {
      const $inner = $('#inner');
      const $button = $('#button');
      eventCount = 0;

      $inner.on('click.a.b.c', function () {
        eventCount += 1;
      });
      $inner.on('click.a.b', function () {
        eventCount += 2;
      });
      $inner.on('click.a', function () {
        eventCount += 4;
      });
      $inner.on('click', function () {
        eventCount += 8;
      });
      $inner.on('input.a', function () {
        eventCount += 16;
      });
      $inner.on('click.a', '#button', function () {
        eventCount += 32;
      });
      $inner.on('click', '#button', function () {
        eventCount += 64;
      });

      $inner.trigger('click.a.b.c');
      assert.equal(eventCount, 1);
      eventCount = 0;

      $inner.trigger('click.a.b');
      assert.equal(eventCount, 3);
      eventCount = 0;

      $inner.trigger('click.a');
      assert.equal(eventCount, 7);
      eventCount = 0;

      $inner.trigger('click');
      assert.equal(eventCount, 15);
      eventCount = 0;

      $inner.trigger('a.b');
      assert.equal(eventCount, 0);

      $inner.trigger('click.b');
      assert.equal(eventCount, 3);
      eventCount = 0;

      $inner.trigger('click.c.b');
      assert.equal(eventCount, 1);
      eventCount = 0;

      $inner.trigger('input');
      assert.equal(eventCount, 16);
      eventCount = 0;

      $inner.trigger('input.a');
      assert.equal(eventCount, 16);
      eventCount = 0;

      $inner.trigger('input.b');
      assert.equal(eventCount, 0);

      $button.trigger('click.a');
      assert.equal(eventCount, 39);
      eventCount = 0;

      $button.trigger('click');
      assert.equal(eventCount, 111);
      eventCount = 0;

      $inner.off('c');
      $inner.trigger('click');
      assert.equal(eventCount, 15);
      eventCount = 0;

      $inner.off('click.c');
      $inner.trigger('click');
      assert.equal(eventCount, 14);
      eventCount = 0;

      $inner.off('.b.a');
      $inner.trigger('click');
      assert.equal(eventCount, 12);
      eventCount = 0;
      $inner.trigger('input');
      assert.equal(eventCount, 16);
      eventCount = 0;

      $inner.off('click.a', '#button');
      $button.trigger('click');
      assert.equal(eventCount, 76);
      eventCount = 0;

      $inner.off('click');
      $inner.trigger('click');
      assert.equal(eventCount, 0);
    });

    if (!isJquery) {
      it('.trigger(type, detail, options)', () => {
        const $inner = $('#inner');

        $inner.on('click input', function (event, detail) {
          switch (event.type) {
            case 'click':
              assert.isUndefined(detail);
              assert.isFalse(event.cancelable);
              assert.isTrue(event.composed);
              assert.isTrue(event.bubbles);
              break;
            case 'input':
              assert.deepEqual(detail, { key: 'val' });
              assert.isTrue(event.cancelable);
              assert.isFalse(event.composed);
              assert.isFalse(event.bubbles);
          }
        });

        $inner.trigger('click');
        $inner.trigger(
          'input',
          { key: 'val' },
          {
            cancelable: true,
            composed: false,
            bubbles: false,
          },
        );
      });
    }
  });
};

test(jq, 'jq');
test(jQuery as unknown as JQStatic, 'jQuery');
