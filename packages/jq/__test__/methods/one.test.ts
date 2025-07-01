import '../../methods/one.js';
import '../../methods/trigger.js';
import { jQuery, jq, assert, JQStatic } from '../utils.js';

const test = ($: JQStatic, type: string): void => {
  describe(`${type} - .one`, () => {
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

    it('.one(type, fn)', () => {
      const $inner = $('#inner');
      eventCount = 0;

      $inner.one('click', function () {
        // this 指向触发事件的元素
        assert.deepEqual($inner[0], this);
        eventCount++;
      });
      $inner.trigger('click');
      assert.equal(eventCount, 1);
      $inner.trigger('click');
      assert.equal(eventCount, 1);
    });

    it('.one(muliple_type, fn)', () => {
      const $inner = $('#inner');
      eventCount = 0;

      $inner.one('click input customEvent', callback);

      $inner.trigger('click');
      assert.equal(eventCount, 1);
      $inner.trigger('click');
      assert.equal(eventCount, 1);

      $inner.off('input');
      $inner.trigger('input');
      assert.equal(eventCount, 1);

      $inner.trigger('customEvent');
      assert.equal(eventCount, 2);
      $inner.trigger('customEvent');
      assert.equal(eventCount, 2);
    });

    it('.one(type, data, fn)', () => {
      const $inner = $('#inner');
      eventCount = 0;

      $inner.one('input', true, (event) => {
        eventCount++;
        assert.isTrue(event.data);
      });

      $inner.one('change', { key: 'val' }, (event) => {
        eventCount++;
        assert.deepEqual(event.data, {
          key: 'val',
        });
      });

      // 若 data 为字符串参数时，必须指定 selector 参数
      $inner.one('click', undefined, 'test-val', (event) => {
        eventCount++;
        assert.equal(event.data, 'test-val');
      });

      $inner.one('dbclick', null, 'test-val', (event) => {
        eventCount++;
        assert.equal(event.data, 'test-val');
      });

      $inner.trigger('input');
      $inner.trigger('change');
      $inner.trigger('click');
      $inner.trigger('dbclick');

      $inner.trigger('input');
      $inner.trigger('change');
      $inner.trigger('click');
      $inner.trigger('dbclick');

      assert.equal(eventCount, 4);
    });

    it('.one(type, selector, fn)', () => {
      const $inner = $('#inner');
      const $button = $('#button');
      eventCount = 0;

      $inner.one('click', '#button', function (event, data1, data2) {
        eventCount++;
        assert.deepEqual($button[0], this);
        assert.deepEqual(event.target, $button[0]);
        assert.equal(data1, 'data1');
        assert.equal(data2, 'data2');
      });

      $button.trigger('click', ['data1', 'data2']);
      $button.trigger('input');
      $button.trigger('click');

      assert.equal(eventCount, 1);
    });

    it('.one(type, selector, data, fn)', () => {
      const $inner = $('#inner');
      const $button = $('#button');
      eventCount = 0;

      $inner.one('click', '#button', 'test-data', (event) => {
        eventCount++;
        assert.deepEqual(event.target, $button[0]);
        assert.equal(event.data, 'test-data');
      });

      $inner.one('click', '#button', 33, (event) => {
        eventCount = eventCount + 2;
        assert.deepEqual(event.target, $button[0]);
        assert.deepEqual(event.data, 33);
      });

      $button.trigger('click');
      $button.trigger('click');

      assert.equal(eventCount, 3);
    });

    it('.one(object)', () => {
      const $inner = $('#inner');
      eventCount = 0;

      $inner.one({
        click: function () {
          eventCount++;
          assert.deepEqual($inner[0], this);
        },
        input: callback2,
        customEvent: callback,
      });

      $inner.trigger('click');
      $inner.trigger('click');
      assert.equal(eventCount, 1);
      $inner.trigger('input');
      $inner.trigger('input');
      assert.equal(eventCount, 3);
      $inner.trigger('customEvent');
      $inner.trigger('customEvent');
      assert.equal(eventCount, 4);
    });

    it('.one(object, data)', () => {
      const $inner = $('#inner');
      eventCount = 0;

      $inner.one(
        {
          click: (event, data) => {
            eventCount++;
            assert.equal(data, 'data');
            assert.equal(event.type, 'click');
            assert.equal(event.data, 'test-data');
          },
          input: (event, data1, data2) => {
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
      $inner.trigger('click', 'data1');
      assert.equal(eventCount, 1);

      $inner.trigger('input', ['data1', 'data2']);
      $inner.trigger('input', ['data11', 'data22']);
      assert.equal(eventCount, 2);

      $inner.one(
        {
          change: () => {
            eventCount++;
          },
        },
        { key: 'val' },
      );
      $inner.trigger('change');
      $inner.trigger('change');
      assert.equal(eventCount, 3);
    });

    it('.one(object, selector)', () => {
      const $inner = $('#inner');
      const $button = $('#button');
      eventCount = 0;

      $inner.one(
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
      $button.trigger('click');
      assert.equal(eventCount, 1);

      $button.trigger('change', 'val');
      $button.trigger('change', 'val2');
      assert.equal(eventCount, 2);

      $inner.one(
        {
          input: callback,
          dbclick: callback2,
        },
        null,
      );

      $inner.trigger('input');
      $inner.trigger('input');
      assert.equal(eventCount, 3);

      $inner.trigger('dbclick');
      $inner.trigger('dbclick');
      assert.equal(eventCount, 5);
    });

    it('.one(object, selector, data)', () => {
      const $inner = $('#inner');
      const $button = $('#button');
      eventCount = 0;

      $inner.one(
        {
          click: (event, data) => {
            eventCount++;
            assert.isUndefined(data);
            assert.equal(event.data, 'test-data');
            if (!isJquery) {
              assert.isNull(event.detail);
            }
          },
          change: (event, data1, data2) => {
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
      $button.trigger('click');
      assert.equal(eventCount, 1);

      $button.trigger('change', ['data1', 'data2']);
      $button.trigger('change', ['data11', 'data22']);
      assert.equal(eventCount, 2);
    });

    it('.one(namespace)', () => {
      const $inner = $('#inner');
      const $button = $('#button');
      eventCount = 0;

      $inner.one('click.a.b.c', () => {
        eventCount += 1;
      });
      $inner.one('click.a.b', () => {
        eventCount += 2;
      });
      $inner.one('click.a', () => {
        eventCount += 4;
      });
      $inner.one('click', () => {
        eventCount += 8;
      });
      $inner.one('input.a', () => {
        eventCount += 16;
      });
      $inner.one('click.a', '#button', () => {
        eventCount += 32;
      });
      $inner.one('click', '#button', () => {
        eventCount += 64;
      });

      $inner.trigger('click.a.b.c');
      assert.equal(eventCount, 1);
      eventCount = 0;

      $inner.trigger('click.a');
      assert.equal(eventCount, 6);
      eventCount = 0;

      $inner.trigger('click');
      assert.equal(eventCount, 8);
      eventCount = 0;

      $inner.trigger('a.b');
      assert.equal(eventCount, 0);

      $inner.trigger('click.b');
      assert.equal(eventCount, 0);
      eventCount = 0;

      $inner.trigger('input');
      assert.equal(eventCount, 16);
      eventCount = 0;

      $inner.trigger('input.a');
      assert.equal(eventCount, 0);
      eventCount = 0;

      $button.trigger('click');
      assert.equal(eventCount, 96);
      eventCount = 0;
    });
  });
};

test(jq, 'jq');
test(jQuery as unknown as JQStatic, 'jQuery');
