// 目前队列不打包进 mdui.JQ 中
describe('queue 队列', function () {

  it('$.queue() $.dequeue() - 队列中添加函数和弹出函数', function () {
    var queueName = 'queueName';
    var test = document.getElementById("test");

    // 空队列
    assert.deepEqual($.queue(queueName), []);

    // 添加一个函数
    $.queue(queueName, function () {
      test.textContent = 'queue1';
    });
    assert.equal($.queue(queueName).length, 1);

    // 再添加一个函数
    $.queue(queueName, function () {
      test.textContent = 'queue2';
    });
    assert.equal($.queue(queueName).length, 2);

    // 弹出一个函数
    $.dequeue(queueName);
    assert.equal(test.textContent, 'queue1');
    assert.equal($.queue(queueName).length, 1);

    // 再弹出一个函数
    $.dequeue(queueName);
    assert.equal(test.textContent, 'queue2');
    assert.equal($.queue(queueName).length, 0);

    test.textContent = '';
  });

  it('$.clearQueue() - 清空队列', function () {
    var queueName = 'queueName';
    var test = document.getElementById("test");

    // 队列中添加两个函数
    $.queue(queueName, function () {
      test.textContent = 'queue1';
    });
    $.queue(queueName, function () {
      test.textContent = 'queue2';
    });
    assert.equal($.queue(queueName).length, 2);

    // 清空队列
    $.clearQueue(queueName);
    assert.deepEqual($.queue(queueName), []);
  });
});
