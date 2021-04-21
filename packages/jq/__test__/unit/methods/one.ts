import { assert } from 'chai';
import $ from '../../jq_or_jquery';

// @ts-ignore
const isJquery = typeof jQuery !== 'undefined';

let eventCount = 0;
const callback = function (): void {
  eventCount++;
};
const callback2 = function (): void {
  eventCount = eventCount + 2;
};

describe('.one()', function () {
  beforeEach(function () {
    // 每次都移除元素，并重新创建，确保原有事件全部移除
    $('#test').html('<div id="inner"><button id="button"></button></div>');
  });

  it('.one(type, fn)', function () {
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

  it('.one(muliple_type, fn)', function () {
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

  it('.one(type, data, fn)', function () {
    const $inner = $('#inner');
    eventCount = 0;

    $inner.one('input', true, function (event) {
      eventCount++;
      // @ts-ignore
      assert.isTrue(isJquery ? event.data : event._data);
    });

    $inner.one('change', { key: 'val' }, function (event) {
      eventCount++;
      // @ts-ignore
      assert.deepEqual(isJquery ? event.data : event._data, {
        key: 'val',
      });
    });

    // 若 data 为字符串参数时，必须指定 selector 参数
    $inner.one('click', undefined, 'test-val', function (event) {
      eventCount++;
      // @ts-ignore
      assert.equal(isJquery ? event.data : event._data, 'test-val');
    });

    $inner.one('dbclick', null, 'test-val', function (event) {
      eventCount++;
      // @ts-ignore
      assert.equal(isJquery ? event.data : event._data, 'test-val');
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

  it('.one(type, selector, fn)', function () {
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

  it('.one(type, selector, data, fn)', function () {
    const $inner = $('#inner');
    const $button = $('#button');
    eventCount = 0;

    $inner.one('click', '#button', 'test-data', function (event) {
      eventCount++;
      assert.deepEqual(event.target, $button[0]);
      // @ts-ignore
      assert.equal(isJquery ? event.data : event._data, 'test-data');
    });

    $inner.one('click', '#button', 33, function (event) {
      eventCount = eventCount + 2;
      assert.deepEqual(event.target, $button[0]);
      // @ts-ignore
      assert.deepEqual(isJquery ? event.data : event._data, 33);
    });

    $button.trigger('click');
    $button.trigger('click');

    assert.equal(eventCount, 3);
  });

  it('.one(object)', function () {
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

  it('.one(object, data)', function () {
    const $inner = $('#inner');
    eventCount = 0;

    $inner.one(
      {
        click: function (event, data) {
          eventCount++;
          assert.equal(data, 'data');
          assert.equal(event.type, 'click');
          // @ts-ignore
          assert.equal(isJquery ? event.data : event._data, 'test-data');
        },
        input: function (event, data1, data2) {
          eventCount++;
          assert.equal(data1, 'data1');
          assert.equal(data2, 'data2');
          assert.equal(event.type, 'input');
          // @ts-ignore
          assert.equal(isJquery ? event.data : event._data, 'test-data');
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
        change: function () {
          eventCount++;
        },
      },
      { key: 'val' },
    );
    $inner.trigger('change');
    $inner.trigger('change');
    assert.equal(eventCount, 3);
  });

  it('.one(object, selector)', function () {
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
          // @ts-ignore
          assert.isUndefined(isJquery ? event.data : event._data);
          // @ts-ignore
          !isJquery && assert.isUndefined(event._detail);
        },
        change: function (event, data) {
          eventCount++;
          assert.deepEqual($button[0], this);
          assert.equal(data, 'val');
          assert.equal(event.type, 'change');
          // @ts-ignore
          assert.isUndefined(isJquery ? event.data : event._data);
          // @ts-ignore
          !isJquery && assert.equal(event._detail, 'val');
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

  it('.one(object, selector, data)', function () {
    const $inner = $('#inner');
    const $button = $('#button');
    eventCount = 0;

    $inner.one(
      {
        click: function (event, data) {
          eventCount++;
          assert.isUndefined(data);
          // @ts-ignore
          assert.equal(isJquery ? event.data : event._data, 'test-data');
          // @ts-ignore
          !isJquery && assert.isUndefined(event._detail);
        },
        change: function (event, data1, data2) {
          eventCount++;
          assert.equal(data1, 'data1');
          assert.equal(data2, 'data2');
          // @ts-ignore
          assert.equal(isJquery ? event.data : event._data, 'test-data');
          if (!isJquery) {
            // @ts-ignore
            assert.sameOrderedMembers(event._detail, ['data1', 'data2']);
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

  it('.one(namespace)', function () {
    const $inner = $('#inner');
    const $button = $('#button');
    eventCount = 0;

    $inner.one('click.a.b.c', function () {
      eventCount += 1;
    });
    $inner.one('click.a.b', function () {
      eventCount += 2;
    });
    $inner.one('click.a', function () {
      eventCount += 4;
    });
    $inner.one('click', function () {
      eventCount += 8;
    });
    $inner.one('input.a', function () {
      eventCount += 16;
    });
    $inner.one('click.a', '#button', function () {
      eventCount += 32;
    });
    $inner.one('click', '#button', function () {
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
