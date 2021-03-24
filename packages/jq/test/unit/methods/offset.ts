import { assert } from 'chai';
import $ from '../../jq_or_jquery';

describe('.offset()', function () {
  beforeEach(function () {
    $('#test')
      .html(
        `
<div
  id="fixed"
  style="
    position: fixed;
    top: 100px;
    left: 200px;
    width: 50px;
    height: 50px;
  "
>
  <div
    id="child-absolute"
    style="
      position: absolute;
      top: 50px;
      left: 100px;
      width: 50px;
      height: 50px;
    "
  ></div>
  <div
    id="child-static"
    style="
      position: static;
      top: 100px;
      left: 150px;
      width: 50px;
      height: 50px;
    "
  >
    <div id="top-auto" style="position: absolute; top: auto;"></div>
  </div>
</div>
<div
  id="absolute"
  style="
    position: absolute;
    top: 200px;
    left: 300px;
    width: 50px;
    height: 50px;
  "
></div>
      `,
      )
      .css('overflow', 'hidden');
  });

  it('.offset()', function () {
    const $fixed = $('#fixed');
    const $absolute = $('#absolute');
    const $childAbsolute = $('#child-absolute');
    const $childStatic = $('#child-static');

    assert.isUndefined($().offset());
    assert.deepEqual($fixed.offset(), { top: 100, left: 200 });
    assert.deepEqual($absolute.offset(), { top: 200, left: 300 });
    assert.deepEqual($childAbsolute.offset(), { top: 150, left: 300 });
    assert.deepEqual($childStatic.offset(), { top: 100, left: 200 });
  });

  it('.offset(value)', function () {
    const $fixed = $('#fixed');
    const $childStatic = $('#child-static');
    const $topAuto = $('#top-auto');

    $fixed.offset({ top: 50, left: 100 });
    assert.deepEqual($fixed.offset(), { top: 50, left: 100 });

    $fixed.offset({ top: 60 });
    assert.deepEqual($fixed.offset(), { top: 60, left: 100 });

    $fixed.offset({ left: 80 });
    assert.deepEqual($fixed.offset(), { top: 60, left: 80 });

    $childStatic.offset({ top: 20, left: 80 });
    assert.deepEqual($childStatic.offset(), { top: 20, left: 80 });

    $topAuto.offset({ top: 40, left: 60 });
    assert.deepEqual($topAuto.offset(), { top: 40, left: 60 });
  });

  it('.offset(callback)', function () {
    interface Coordinates {
      left: number;
      top: number;
    }
    const $fixed = $('#fixed');

    const _thiss: HTMLElement[] = [];
    const _indexs: number[] = [];
    const _oldOffsets: Coordinates[] = [];

    $fixed.offset(function (index, offset) {
      _thiss.push(this);
      _indexs.push(index);
      _oldOffsets.push(offset);

      return {
        left: offset.left + 20,
        top: offset.top + 20,
      };
    });

    assert.sameOrderedMembers(_thiss, $fixed.get());
    assert.sameOrderedMembers(_indexs, [0]);
    assert.deepEqual(_oldOffsets, [{ top: 100, left: 200 }]);
    assert.deepEqual($fixed.offset(), { top: 120, left: 220 });
  });
});
