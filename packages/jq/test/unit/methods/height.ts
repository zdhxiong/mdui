import $ from '../../jq_or_jquery';

describe('.height()', function() {
  beforeEach(function() {
    $('#test').html(`
<div
  id="child"
  style="
    width: 100px;
    height: 500px;
    display: block;
    padding: 20px;
    border: 5px solid #000;
    margin: 3px;
  "
>
  <div
    id="percent"
    class="children"
    style="
      width: 40%;
      height: 60%;
      display: block;
      padding: 10px;
      border: 6px solid #000;
      margin: 2px;
    "
  >a</div>
  <div
    class="children"
    style="
      height: 20px;
    "
  >b</div>
</div>
    `);
  });

  it('.height(value)', function() {
    const $child = $('#child');
    const $percent = $('#percent');

    $child.height(10);
    chai.assert.deepEqual($child.height(), 10);

    $child.height('20');
    chai.assert.deepEqual($child.height(), 20);

    $child.height('30px');
    chai.assert.deepEqual($child.height(), 30);

    $percent.height('50%');
    chai.assert.deepEqual($percent.height(), 15);

    $percent.height('23%');
    chai.assert.deepEqual($percent.height(), 6.9);
  });

  it('.height(callback)', function() {
    const $child = $('#child');
    const $percent = $('#percent');
    const $children = $('.children');

    const _thisss: HTMLElement[] = [];
    const _indexs: number[] = [];
    const _oldValues: number[] = [];

    $children.height(function(index, oldValue) {
      _thisss.push(this);
      _indexs.push(index);
      _oldValues.push(oldValue);
    });

    chai.assert.sameOrderedMembers(_thisss, $children.get());
    chai.assert.sameOrderedMembers(_indexs, [0, 1]);
    chai.assert.sameOrderedMembers(_oldValues, [300, 20]);

    $child.height(function() {
      return 10;
    });
    chai.assert.deepEqual($child.height(), 10);

    $child.height(function() {
      return '20';
    });
    chai.assert.deepEqual($child.height(), 20);

    $child.height(function() {
      return '30px';
    });
    chai.assert.deepEqual($child.height(), 30);

    $percent.height(function() {
      return '50%';
    });
    chai.assert.deepEqual($percent.height(), 15);

    $percent.height(function() {
      return '23%';
    });
    chai.assert.deepEqual($percent.height(), 6.9);

    $child.height(function(_, oldValue) {
      return oldValue + 10;
    });
    chai.assert.deepEqual($child.height(), 40);

    $child.height(function() {
      return null;
    });
    chai.assert.deepEqual($child.height(), 40);

    $child.height(function() {
      return undefined;
    });
    chai.assert.deepEqual($child.height(), 40);

    $child.height(function() {
      // no return
    });
    chai.assert.deepEqual($child.height(), 40);
  });

  it('.height()', function() {
    const $child = $('#child');
    const $percent = $('#percent');

    const windowHeight = $(window).height();
    chai.assert.deepEqual(windowHeight, document.documentElement.clientHeight);

    const documentHeight = $(document).height();
    chai.assert.deepEqual(
      documentHeight,
      Math.max(
        document.body.scrollHeight,
        document.documentElement.scrollHeight,
        document.body.offsetHeight,
        document.documentElement.offsetHeight,
        document.documentElement.clientHeight,
      ),
    );

    chai.assert.isUndefined($().height());

    chai.assert.deepEqual($child.height(), 500);
    chai.assert.deepEqual($percent.height(), 300);
  });
});
