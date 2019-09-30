import $ from '../../jq_or_jquery';

describe('.width()', function() {
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
      width: 20px;
    "
  >b</div>
</div>
    `);
  });

  it('.width(value)', function() {
    const $child = $('#child');
    const $percent = $('#percent');

    $child.width(10);
    chai.assert.deepEqual($child.width(), 10);

    $child.width('20');
    chai.assert.deepEqual($child.width(), 20);

    $child.width('30px');
    chai.assert.deepEqual($child.width(), 30);

    $percent.width('50%');
    chai.assert.deepEqual($percent.width(), 15);

    $percent.width('23%');
    chai.assert.deepEqual($percent.width(), 6.9);
  });

  it('.width(callback)', function() {
    const $child = $('#child');
    const $percent = $('#percent');
    const $children = $('.children');

    const _thisss: HTMLElement[] = [];
    const _indexs: number[] = [];
    const _oldValues: number[] = [];

    $children.width(function(index, oldValue) {
      _thisss.push(this);
      _indexs.push(index);
      _oldValues.push(oldValue);
    });

    chai.assert.sameOrderedMembers(_thisss, $children.get());
    chai.assert.sameOrderedMembers(_indexs, [0, 1]);
    chai.assert.sameOrderedMembers(_oldValues, [40, 20]);

    $child.width(function() {
      return 10;
    });
    chai.assert.deepEqual($child.width(), 10);

    $child.width(function() {
      return '20';
    });
    chai.assert.deepEqual($child.width(), 20);

    $child.width(function() {
      return '30px';
    });
    chai.assert.deepEqual($child.width(), 30);

    $percent.width(function() {
      return '50%';
    });
    chai.assert.deepEqual($percent.width(), 15);

    $percent.width(function() {
      return '23%';
    });
    chai.assert.deepEqual($percent.width(), 6.9);

    $child.width(function(_, oldValue) {
      return oldValue + 10;
    });
    chai.assert.deepEqual($child.width(), 40);

    $child.width(function() {
      return null;
    });
    chai.assert.deepEqual($child.width(), 40);

    $child.width(function() {
      return undefined;
    });
    chai.assert.deepEqual($child.width(), 40);

    $child.width(function() {
      // no return
    });
    chai.assert.deepEqual($child.width(), 40);
  });

  it('.width()', function() {
    const $child = $('#child');
    const $percent = $('#percent');

    const windowWidth = $(window).width();
    chai.assert.deepEqual(windowWidth, document.documentElement.clientWidth);

    const documentWidth = $(document).width();
    chai.assert.deepEqual(
      documentWidth,
      Math.max(
        document.body.scrollWidth,
        document.documentElement.scrollWidth,
        document.body.offsetWidth,
        document.documentElement.offsetWidth,
        document.documentElement.clientWidth,
      ),
    );

    chai.assert.isUndefined($().width());

    chai.assert.deepEqual($child.width(), 100);
    chai.assert.deepEqual($percent.width(), 40);
  });
});
