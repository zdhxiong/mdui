import $ from '../../jq_or_jquery';

// @ts-ignore
const isJquery = typeof jQuery !== 'undefined';

let eventCount = 0;
const callback = function(): void {
  eventCount++;
};
const callback2 = function(): void {
  eventCount = eventCount + 2;
};

describe('.on()', function() {
  beforeEach(function() {
    // 每次都移除元素，并重新创建，确保原有事件全部移除
    $('#test').html('<div id="inner"><button id="button"></button></div>');
  });

  it('.on(type, fn)', function() {
    const $inner = $('#inner');
    eventCount = 0;

    $inner.on('click', function() {
      // this 指向触发事件的元素
      chai.assert.deepEqual($inner[0], this);
      eventCount++;
    });
    $inner.trigger('click');
    chai.assert.equal(eventCount, 1);

    $inner.off('click');
    $inner.trigger('click');
    chai.assert.equal(eventCount, 1);
  });

  it('.on(muliple_type, fn)', function() {
    const $inner = $('#inner');
    eventCount = 0;

    $inner.on('click input customEvent', callback);
    $inner.trigger('click');
    chai.assert.equal(eventCount, 1);
    $inner.trigger('input');
    chai.assert.equal(eventCount, 2);
    $inner.trigger('customEvent');
    chai.assert.equal(eventCount, 3);

    $inner.off('input');
    $inner.trigger('click');
    chai.assert.equal(eventCount, 4);
    $inner.trigger('input');
    chai.assert.equal(eventCount, 4);
    $inner.trigger('customEvent');
    chai.assert.equal(eventCount, 5);

    $inner.off('click customEvent');
    $inner.trigger('click');
    $inner.trigger('input');
    $inner.trigger('customEvent');
    chai.assert.equal(eventCount, 5);
  });

  it('.trigger(type, data)', function() {
    const $inner = $('#inner');
    eventCount = 0;

    $inner.on('click input change dbclick customEvent', function(
      event,
      data,
      data2,
    ) {
      chai.assert.isTrue(
        ['click', 'input', 'change', 'dbclick', 'customEvent'].includes(
          event.type,
        ),
      );

      switch (event.type) {
        case 'click':
          eventCount++;
          chai.assert.equal(data, 'click-data');
          // @ts-ignore
          !isJquery && chai.assert.equal(event._detail, 'click-data');
          break;

        case 'input':
          eventCount++;
          chai.assert.deepEqual(data, { key: 'val' });
          // @ts-ignore
          !isJquery && chai.assert.deepEqual(event._detail, { key: 'val' });
          break;

        case 'change':
          eventCount++;
          chai.assert.deepEqual(data, 22);
          // @ts-ignore
          !isJquery && chai.assert.deepEqual(event._detail, 22);
          break;

        case 'dbclick':
          eventCount++;
          chai.assert.isTrue(data);
          // @ts-ignore
          !isJquery && chai.assert.isTrue(event._detail);
          break;

        case 'customEvent':
          eventCount++;
          chai.assert.equal(data, 'custom-data');
          chai.assert.equal(data2, 'custom-value');
          if (!isJquery) {
            // @ts-ignore
            chai.assert.sameOrderedMembers(event._detail, [
              'custom-data',
              'custom-value',
            ]);
          }
          break;
      }
    });

    $inner.trigger('click', 'click-data');
    $inner.trigger('input', { key: 'val' });
    $inner.trigger('change', 22);
    $inner.trigger('dbclick', true);
    $inner.trigger('customEvent', ['custom-data', 'custom-value']);

    chai.assert.equal(eventCount, 5);
  });

  it('.on(type, data, fn)', function() {
    const $inner = $('#inner');
    eventCount = 0;

    $inner.on('input', true, function(event) {
      eventCount++;
      // @ts-ignore
      chai.assert.isTrue(isJquery ? event.data : event._data);
    });

    $inner.on('change', { key: 'val' }, function(event) {
      eventCount++;
      // @ts-ignore
      chai.assert.deepEqual(isJquery ? event.data : event._data, {
        key: 'val',
      });
    });

    // 若 data 为字符串参数时，必须指定 selector 参数
    $inner.on('click', undefined, 'test-val', function(event) {
      eventCount++;
      // @ts-ignore
      chai.assert.equal(isJquery ? event.data : event._data, 'test-val');
    });

    $inner.on('dbclick', null, 'test-val', function(event) {
      eventCount++;
      // @ts-ignore
      chai.assert.equal(isJquery ? event.data : event._data, 'test-val');
    });

    $inner.trigger('input');
    $inner.trigger('change');
    $inner.trigger('click');
    $inner.trigger('dbclick');

    chai.assert.equal(eventCount, 4);
  });

  it('.on(type, selector, fn)', function() {
    const $inner = $('#inner');
    const $button = $('#button');
    eventCount = 0;

    $inner.on('click', '#button', function(event, data1, data2) {
      eventCount++;
      chai.assert.deepEqual($button[0], this);
      chai.assert.deepEqual(event.target, $button[0]);
      chai.assert.equal(data1, 'data1');
      chai.assert.equal(data2, 'data2');
    });

    $button.trigger('click', ['data1', 'data2']);
    $button.trigger('input');

    chai.assert.equal(eventCount, 1);
  });

  it('.on(type, selector, data, fn)', function() {
    const $inner = $('#inner');
    const $button = $('#button');
    eventCount = 0;

    $inner.on('click', '#button', 'test-data', function(event) {
      eventCount++;
      chai.assert.deepEqual(event.target, $button[0]);
      // @ts-ignore
      chai.assert.equal(isJquery ? event.data : event._data, 'test-data');
    });

    $inner.on('click', '#button', 33, function(event) {
      eventCount++;
      chai.assert.deepEqual(event.target, $button[0]);
      // @ts-ignore
      chai.assert.deepEqual(isJquery ? event.data : event._data, 33);
    });

    $button.trigger('click');

    chai.assert.equal(eventCount, 2);
  });

  it('.on(object)', function() {
    const $inner = $('#inner');
    eventCount = 0;

    $inner.on({
      click: function() {
        eventCount++;
        chai.assert.deepEqual($inner[0], this);
      },
      input: callback2,
      customEvent: callback,
    });

    $inner.trigger('click');
    chai.assert.equal(eventCount, 1);
    $inner.trigger('input');
    chai.assert.equal(eventCount, 3);
    $inner.trigger('customEvent');
    chai.assert.equal(eventCount, 4);
  });

  it('.on(object, data)', function() {
    const $inner = $('#inner');
    eventCount = 0;

    $inner.on(
      {
        click: function(event, data) {
          eventCount++;
          chai.assert.equal(data, 'data');
          chai.assert.equal(event.type, 'click');
          // @ts-ignore
          chai.assert.equal(isJquery ? event.data : event._data, 'test-data');
        },
        input: function(event, data1, data2) {
          eventCount++;
          chai.assert.equal(data1, 'data1');
          chai.assert.equal(data2, 'data2');
          chai.assert.equal(event.type, 'input');
          // @ts-ignore
          chai.assert.equal(isJquery ? event.data : event._data, 'test-data');
        },
      },
      null,
      'test-data', // data 为字符串时，必须指定 selector
    );

    $inner.trigger('click', 'data');
    chai.assert.equal(eventCount, 1);

    $inner.trigger('input', ['data1', 'data2']);
    chai.assert.equal(eventCount, 2);

    $inner.on(
      {
        change: function() {
          eventCount++;
        },
      },
      { key: 'val' },
    );
    $inner.trigger('change');
    chai.assert.equal(eventCount, 3);
  });

  it('.on(object, selector)', function() {
    const $inner = $('#inner');
    const $button = $('#button');
    eventCount = 0;

    $inner.on(
      {
        click: function(event, data) {
          eventCount++;
          chai.assert.deepEqual($button[0], this);
          chai.assert.isUndefined(data);
          chai.assert.equal(event.type, 'click');
          // @ts-ignore
          chai.assert.isUndefined(isJquery ? event.data : event._data);
          // @ts-ignore
          !isJquery && chai.assert.isUndefined(event._detail);
        },
        change: function(event, data) {
          eventCount++;
          chai.assert.deepEqual($button[0], this);
          chai.assert.equal(data, 'val');
          chai.assert.equal(event.type, 'change');
          // @ts-ignore
          chai.assert.isUndefined(isJquery ? event.data : event._data);
          // @ts-ignore
          !isJquery && chai.assert.equal(event._detail, 'val');
        },
      },
      '#button',
    );

    $button.trigger('click');
    chai.assert.equal(eventCount, 1);

    $button.trigger('change', 'val');
    chai.assert.equal(eventCount, 2);

    $inner.on(
      {
        input: callback,
        dbclick: callback2,
      },
      null,
    );

    $inner.trigger('input');
    chai.assert.equal(eventCount, 3);

    $inner.trigger('dbclick');
    chai.assert.equal(eventCount, 5);
  });

  it('.on(object, selector, data)', function() {
    const $inner = $('#inner');
    const $button = $('#button');
    eventCount = 0;

    $inner.on(
      {
        click: function(event, data) {
          eventCount++;
          chai.assert.isUndefined(data);
          // @ts-ignore
          chai.assert.equal(isJquery ? event.data : event._data, 'test-data');
          // @ts-ignore
          !isJquery && chai.assert.isUndefined(event._detail);
        },
        change: function(event, data1, data2) {
          eventCount++;
          chai.assert.equal(data1, 'data1');
          chai.assert.equal(data2, 'data2');
          // @ts-ignore
          chai.assert.equal(isJquery ? event.data : event._data, 'test-data');
          if (!isJquery) {
            // @ts-ignore
            chai.assert.sameOrderedMembers(event._detail, ['data1', 'data2']);
          }
        },
      },
      '#button',
      'test-data',
    );

    $button.trigger('click');
    chai.assert.equal(eventCount, 1);

    $button.trigger('change', ['data1', 'data2']);
    chai.assert.equal(eventCount, 2);
  });

  it('.on(type, false)', function() {
    const $test = $('#test');

    // 点击 a 链接时，默认会跳转；事件的回调函数返回 false，则不会跳转
    $test.html('<a id="link" href="https://mdui.org">mdui</a>');

    const $link = $('#link');

    $link.on('click', false);
    $link.trigger('click');
    $link.off('click');

    $link.on('click', function() {
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

    $test.on('click', '#link', function() {
      return false;
    });
    $link.trigger('click');
    $link.off('click');

    $test.on('click', '#link', 'test-data', false);
    $link.trigger('click');
    $link.off('click');

    $test.on('click', '#link', 'test-data', function() {
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
      click: function() {
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
        click: function() {
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
        click: function() {
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
        click: function() {
          return false;
        },
      },
      '#link',
      { key: 'val' },
    );
    $link.trigger('click');
    $link.off('click');
  });

  it('.off()', function() {
    const $inner = $('#inner');
    const $button = $('#button');
    eventCount = 0;

    $inner.on('click', callback);
    $inner.on('input', callback2);
    $inner.off();
    $inner.trigger('click');
    $inner.trigger('input');
    chai.assert.equal(eventCount, 0);

    $inner.on('click', callback);
    $inner.on('input', callback2);
    $inner.off('click');
    $inner.trigger('click');
    $inner.trigger('input');
    chai.assert.equal(eventCount, 2);
    $inner.off();

    $inner.on('click', callback);
    $inner.on('click', callback2);
    $inner.off('click', callback2);
    $inner.trigger('click');
    chai.assert.equal(eventCount, 3);
    $inner.off();

    $inner.on('click', '#button', callback);
    $inner.on('input', '#button', callback2);
    $inner.off('click', '#button');
    $button.trigger('click');
    $button.trigger('input');
    chai.assert.equal(eventCount, 5);
    $inner.off();

    $inner.on('click', '#button', callback);
    $inner.on('click', '#button', callback2);
    $inner.off('click', '#button', callback2);
    $button.trigger('click');
    chai.assert.equal(eventCount, 6);
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
    chai.assert.equal(eventCount, 9);
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
    chai.assert.equal(eventCount, 12);
    $inner.off();
  });

  it('.on(namespace)', function() {
    const $inner = $('#inner');
    const $button = $('#button');
    eventCount = 0;

    $inner.on('click.a.b.c', function() {
      eventCount += 1;
    });
    $inner.on('click.a.b', function() {
      eventCount += 2;
    });
    $inner.on('click.a', function() {
      eventCount += 4;
    });
    $inner.on('click', function() {
      eventCount += 8;
    });
    $inner.on('input.a', function() {
      eventCount += 16;
    });
    $inner.on('click.a', '#button', function() {
      eventCount += 32;
    });
    $inner.on('click', '#button', function() {
      eventCount += 64;
    });

    $inner.trigger('click.a.b.c');
    chai.assert.equal(eventCount, 1);
    eventCount = 0;

    $inner.trigger('click.a.b');
    chai.assert.equal(eventCount, 3);
    eventCount = 0;

    $inner.trigger('click.a');
    chai.assert.equal(eventCount, 7);
    eventCount = 0;

    $inner.trigger('click');
    chai.assert.equal(eventCount, 15);
    eventCount = 0;

    $inner.trigger('a.b');
    chai.assert.equal(eventCount, 0);

    $inner.trigger('click.b');
    chai.assert.equal(eventCount, 3);
    eventCount = 0;

    $inner.trigger('click.c.b');
    chai.assert.equal(eventCount, 1);
    eventCount = 0;

    $inner.trigger('input');
    chai.assert.equal(eventCount, 16);
    eventCount = 0;

    $inner.trigger('input.a');
    chai.assert.equal(eventCount, 16);
    eventCount = 0;

    $inner.trigger('input.b');
    chai.assert.equal(eventCount, 0);

    $button.trigger('click.a');
    chai.assert.equal(eventCount, 39);
    eventCount = 0;

    $button.trigger('click');
    chai.assert.equal(eventCount, 111);
    eventCount = 0;

    $inner.off('c');
    $inner.trigger('click');
    chai.assert.equal(eventCount, 15);
    eventCount = 0;

    $inner.off('click.c');
    $inner.trigger('click');
    chai.assert.equal(eventCount, 14);
    eventCount = 0;

    $inner.off('.b.a');
    $inner.trigger('click');
    chai.assert.equal(eventCount, 12);
    eventCount = 0;
    $inner.trigger('input');
    chai.assert.equal(eventCount, 16);
    eventCount = 0;

    $inner.off('click.a', '#button');
    $button.trigger('click');
    chai.assert.equal(eventCount, 76);
    eventCount = 0;

    $inner.off('click');
    $inner.trigger('click');
    chai.assert.equal(eventCount, 0);
  });
});
