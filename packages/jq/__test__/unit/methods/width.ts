import { assert } from 'chai';
import $ from '../../jq_or_jquery';

// 测试 width、height、innerWidth、innerHeight、outerWidth、outerHeight
describe('.width()', function () {
  beforeEach(function () {
    $('#test').html(`
<div
  id="border-box"
  style="
    width: 100px;
    height: 200px;
    display: block;
    padding: 20px;
    border: 5px solid #000;
    margin: 10px;
    box-sizing: border-box;
  "
>
  <div
    id="border-box-inner"
    style="
      width: 50%;
      height: 50%;
      padding: 10%;
      border: 2% solid #000;
      margin: 4%;
    "
  >
  </div>
</div>
<div
  id="content-box"
  style="
    width: 100px;
    height: 200px;
    display: block;
    padding: 20px;
    border: 5px solid #000;
    margin: 10px;
    box-sizing: content-box;
  "
>
  <div
    id="content-box-inner"
    style="
      width: 50%;
      height: 50%;
      padding: 10%;
      border: 2% solid #000;
      margin: 4%;
    "
  >
  </div>
</div>
    `);
  });

  it('$().width()', function () {
    assert.isUndefined($().width());
    assert.isUndefined($().innerWidth());
    assert.isUndefined($().outerWidth());
    assert.isUndefined($().outerWidth(true));

    assert.isUndefined($().height());
    assert.isUndefined($().innerHeight());
    assert.isUndefined($().outerHeight());
    assert.isUndefined($().outerHeight(true));
  });

  it('.width()', function () {
    // box-sizing: border-box
    const $borderBox = $('#border-box');

    assert.deepEqual($borderBox.width(), 50);
    assert.deepEqual($borderBox.height(), 150);
    assert.deepEqual($borderBox.innerWidth(), 90);
    assert.deepEqual($borderBox.innerHeight(), 190);
    assert.deepEqual($borderBox.outerWidth(), 100);
    assert.deepEqual($borderBox.outerHeight(), 200);
    assert.deepEqual($borderBox.outerWidth(true), 120);
    assert.deepEqual($borderBox.outerHeight(true), 220);
  });

  it('.width()', function () {
    // box-sizing: content-box
    const $contentBox = $('#content-box');

    assert.deepEqual($contentBox.width(), 100);
    assert.deepEqual($contentBox.height(), 200);
    assert.deepEqual($contentBox.innerWidth(), 140);
    assert.deepEqual($contentBox.innerHeight(), 240);
    assert.deepEqual($contentBox.outerWidth(), 150);
    assert.deepEqual($contentBox.outerHeight(), 250);
    assert.deepEqual($contentBox.outerWidth(true), 170);
    assert.deepEqual($contentBox.outerHeight(true), 270);
  });

  it('.width()', function () {
    // box-sizing: border-box 的子元素
    const $borderBoxInner = $('#border-box-inner');

    assert.deepEqual($borderBoxInner.width(), 25);
    assert.deepEqual($borderBoxInner.height(), 75);
    assert.deepEqual($borderBoxInner.innerWidth(), 35);
    assert.deepEqual($borderBoxInner.innerHeight(), 85);
    assert.deepEqual($borderBoxInner.outerWidth(), 35);
    assert.deepEqual($borderBoxInner.outerHeight(), 85);
    assert.deepEqual($borderBoxInner.outerWidth(true), 39);
    assert.deepEqual($borderBoxInner.outerHeight(true), 89);
  });

  it('.width()', function () {
    // box-sizing: content-box 的子元素
    const $contentBoxInner = $('#content-box-inner');

    assert.deepEqual($contentBoxInner.width(), 50);
    assert.deepEqual($contentBoxInner.height(), 100);
    assert.deepEqual($contentBoxInner.innerWidth(), 70);
    assert.deepEqual($contentBoxInner.innerHeight(), 120);
    assert.deepEqual($contentBoxInner.outerWidth(), 70);
    assert.deepEqual($contentBoxInner.outerHeight(), 120);
    assert.deepEqual($contentBoxInner.outerWidth(true), 78);
    assert.deepEqual($contentBoxInner.outerHeight(true), 128);
  });

  it('$(window).width()', function () {
    const $window = $(window);
    const windowWidth = document.documentElement.clientWidth;
    const innerWidth = window.innerWidth;

    assert.deepEqual($window.width(), windowWidth);
    assert.deepEqual($window.innerWidth(), windowWidth);
    assert.deepEqual($window.outerWidth(), innerWidth);
    assert.deepEqual($window.outerWidth(true), innerWidth);

    const windowHeight = document.documentElement.clientHeight;
    const innerHeight = window.innerHeight;

    assert.deepEqual($window.height(), windowHeight);
    assert.deepEqual($window.innerHeight(), windowHeight);
    assert.deepEqual($window.outerHeight(), innerHeight);
    assert.deepEqual($window.outerHeight(true), innerHeight);
  });

  it('$(document).width()', function () {
    const $document = $(document);
    const documentWidth = Math.max(
      document.body.scrollWidth,
      document.documentElement.scrollWidth,
      document.body.offsetWidth,
      document.documentElement.offsetWidth,
      document.documentElement.clientWidth,
    );

    assert.deepEqual($document.width(), documentWidth);
    assert.deepEqual($document.innerWidth(), documentWidth);
    assert.deepEqual($document.outerWidth(), documentWidth);
    assert.deepEqual($document.outerWidth(true), documentWidth);

    const documentHeight = Math.max(
      document.body.scrollHeight,
      document.documentElement.scrollHeight,
      document.body.offsetHeight,
      document.documentElement.offsetHeight,
      document.documentElement.clientHeight,
    );

    assert.deepEqual($document.height(), documentHeight);
    assert.deepEqual($document.innerHeight(), documentHeight);
    assert.deepEqual($document.outerHeight(), documentHeight);
    assert.deepEqual($document.outerHeight(true), documentHeight);
  });

  it('.width(value)', function () {
    // 设置 box-sizing: border-box 的值
    const $borderBox = $('#border-box');

    $borderBox.width(10);
    assert.deepEqual($borderBox.width(), 10);
    assert.deepEqual($borderBox.innerWidth(), 50);
    assert.deepEqual($borderBox.outerWidth(), 60);
    assert.deepEqual($borderBox.outerWidth(true), 80);

    $borderBox.height(30);
    assert.deepEqual($borderBox.height(), 30);
    assert.deepEqual($borderBox.innerHeight(), 70);
    assert.deepEqual($borderBox.outerHeight(), 80);
    assert.deepEqual($borderBox.outerHeight(true), 100);

    $borderBox.innerWidth('100');
    assert.deepEqual($borderBox.width(), 60);
    assert.deepEqual($borderBox.innerWidth(), 100);
    assert.deepEqual($borderBox.outerWidth(), 110);
    assert.deepEqual($borderBox.outerWidth(true), 130);

    $borderBox.innerHeight('300');
    assert.deepEqual($borderBox.height(), 260);
    assert.deepEqual($borderBox.innerHeight(), 300);
    assert.deepEqual($borderBox.outerHeight(), 310);
    assert.deepEqual($borderBox.outerHeight(true), 330);

    $borderBox.outerWidth('100px');
    assert.deepEqual($borderBox.width(), 50);
    assert.deepEqual($borderBox.innerWidth(), 90);
    assert.deepEqual($borderBox.outerWidth(), 100);
    assert.deepEqual($borderBox.outerWidth(true), 120);

    $borderBox.outerHeight('300px');
    assert.deepEqual($borderBox.height(), 250);
    assert.deepEqual($borderBox.innerHeight(), 290);
    assert.deepEqual($borderBox.outerHeight(), 300);
    assert.deepEqual($borderBox.outerHeight(true), 320);

    $borderBox.outerWidth('100px', true);
    assert.deepEqual($borderBox.width(), 30);
    assert.deepEqual($borderBox.innerWidth(), 70);
    assert.deepEqual($borderBox.outerWidth(), 80);
    assert.deepEqual($borderBox.outerWidth(true), 100);

    $borderBox.outerHeight('300px', true);
    assert.deepEqual($borderBox.height(), 230);
    assert.deepEqual($borderBox.innerHeight(), 270);
    assert.deepEqual($borderBox.outerHeight(), 280);
    assert.deepEqual($borderBox.outerHeight(true), 300);

    const $borderBoxInner = $('#border-box-inner');

    $borderBoxInner.width('10%');
    assert.deepEqual($borderBoxInner.width(), 3);
    assert.deepEqual($borderBoxInner.innerWidth(), 9);
    assert.deepEqual($borderBoxInner.outerWidth(), 9);
    assert.deepEqual($borderBoxInner.outerWidth(true), 11.375);

    $borderBoxInner.height('20%');
    assert.deepEqual($borderBoxInner.height(), 46);
    assert.deepEqual($borderBoxInner.innerHeight(), 52);
    assert.deepEqual($borderBoxInner.outerHeight(), 52);
    assert.deepEqual($borderBoxInner.outerHeight(true), 54.375);
  });

  it('.width(value)', function () {
    // 设置 box-sizing: content-box 的值
    const $contentBox = $('#content-box');

    $contentBox.width(10);
    assert.deepEqual($contentBox.width(), 10);
    assert.deepEqual($contentBox.innerWidth(), 50);
    assert.deepEqual($contentBox.outerWidth(), 60);
    assert.deepEqual($contentBox.outerWidth(true), 80);

    $contentBox.height(20);
    assert.deepEqual($contentBox.height(), 20);
    assert.deepEqual($contentBox.innerHeight(), 60);
    assert.deepEqual($contentBox.outerHeight(), 70);
    assert.deepEqual($contentBox.outerHeight(true), 90);

    $contentBox.innerWidth('100');
    assert.deepEqual($contentBox.width(), 60);
    assert.deepEqual($contentBox.innerWidth(), 100);
    assert.deepEqual($contentBox.outerWidth(), 110);
    assert.deepEqual($contentBox.outerWidth(true), 130);

    $contentBox.innerHeight('300');
    assert.deepEqual($contentBox.height(), 260);
    assert.deepEqual($contentBox.innerHeight(), 300);
    assert.deepEqual($contentBox.outerHeight(), 310);
    assert.deepEqual($contentBox.outerHeight(true), 330);

    $contentBox.outerWidth('100px');
    assert.deepEqual($contentBox.width(), 50);
    assert.deepEqual($contentBox.innerWidth(), 90);
    assert.deepEqual($contentBox.outerWidth(), 100);
    assert.deepEqual($contentBox.outerWidth(true), 120);

    $contentBox.outerHeight('300px');
    assert.deepEqual($contentBox.height(), 250);
    assert.deepEqual($contentBox.innerHeight(), 290);
    assert.deepEqual($contentBox.outerHeight(), 300);
    assert.deepEqual($contentBox.outerHeight(true), 320);

    $contentBox.outerWidth('100px', true);
    assert.deepEqual($contentBox.width(), 30);
    assert.deepEqual($contentBox.innerWidth(), 70);
    assert.deepEqual($contentBox.outerWidth(), 80);
    assert.deepEqual($contentBox.outerWidth(true), 100);

    $contentBox.outerHeight('300px', true);
    assert.deepEqual($contentBox.height(), 230);
    assert.deepEqual($contentBox.innerHeight(), 270);
    assert.deepEqual($contentBox.outerHeight(), 280);
    assert.deepEqual($contentBox.outerHeight(true), 300);
  });

  it('.width(null | undefined)', function () {
    // 设置 box-sizing: border-box 的值
    const $borderBox = $('#border-box');

    $borderBox.width(null);
    assert.deepEqual($borderBox.width(), 50);
    assert.deepEqual($borderBox.innerWidth(), 90);
    assert.deepEqual($borderBox.outerWidth(), 100);
    assert.deepEqual($borderBox.outerWidth(true), 120);

    $borderBox.height(null);
    assert.deepEqual($borderBox.height(), 150);
    assert.deepEqual($borderBox.innerHeight(), 190);
    assert.deepEqual($borderBox.outerHeight(), 200);
    assert.deepEqual($borderBox.outerHeight(true), 220);

    $borderBox.innerWidth(undefined);
    assert.deepEqual($borderBox.width(), 50);
    assert.deepEqual($borderBox.innerWidth(), 90);
    assert.deepEqual($borderBox.outerWidth(), 100);
    assert.deepEqual($borderBox.outerWidth(true), 120);

    $borderBox.innerHeight(undefined);
    assert.deepEqual($borderBox.height(), 150);
    assert.deepEqual($borderBox.innerHeight(), 190);
    assert.deepEqual($borderBox.outerHeight(), 200);
    assert.deepEqual($borderBox.outerHeight(true), 220);

    $borderBox.outerWidth(null);
    assert.deepEqual($borderBox.width(), 50);
    assert.deepEqual($borderBox.innerWidth(), 90);
    assert.deepEqual($borderBox.outerWidth(), 100);
    assert.deepEqual($borderBox.outerWidth(true), 120);

    $borderBox.outerHeight(null);
    assert.deepEqual($borderBox.height(), 150);
    assert.deepEqual($borderBox.innerHeight(), 190);
    assert.deepEqual($borderBox.outerHeight(), 200);
    assert.deepEqual($borderBox.outerHeight(true), 220);

    $borderBox.outerWidth(undefined, true);
    assert.deepEqual($borderBox.width(), 50);
    assert.deepEqual($borderBox.innerWidth(), 90);
    assert.deepEqual($borderBox.outerWidth(), 100);
    assert.deepEqual($borderBox.outerWidth(true), 120);

    $borderBox.outerHeight(undefined, true);
    assert.deepEqual($borderBox.height(), 150);
    assert.deepEqual($borderBox.innerHeight(), 190);
    assert.deepEqual($borderBox.outerHeight(), 200);
    assert.deepEqual($borderBox.outerHeight(true), 220);
  });

  it('.width(null | undefined)', function () {
    // 设置 box-sizing: content-box 的值
    const $contentBox = $('#content-box');

    $contentBox.width(null);
    assert.deepEqual($contentBox.width(), 100);
    assert.deepEqual($contentBox.innerWidth(), 140);
    assert.deepEqual($contentBox.outerWidth(), 150);
    assert.deepEqual($contentBox.outerWidth(true), 170);

    $contentBox.height(null);
    assert.deepEqual($contentBox.height(), 200);
    assert.deepEqual($contentBox.innerHeight(), 240);
    assert.deepEqual($contentBox.outerHeight(), 250);
    assert.deepEqual($contentBox.outerHeight(true), 270);

    $contentBox.innerWidth(undefined);
    assert.deepEqual($contentBox.width(), 100);
    assert.deepEqual($contentBox.innerWidth(), 140);
    assert.deepEqual($contentBox.outerWidth(), 150);
    assert.deepEqual($contentBox.outerWidth(true), 170);

    $contentBox.innerHeight(undefined);
    assert.deepEqual($contentBox.height(), 200);
    assert.deepEqual($contentBox.innerHeight(), 240);
    assert.deepEqual($contentBox.outerHeight(), 250);
    assert.deepEqual($contentBox.outerHeight(true), 270);

    $contentBox.outerWidth(null);
    assert.deepEqual($contentBox.width(), 100);
    assert.deepEqual($contentBox.innerWidth(), 140);
    assert.deepEqual($contentBox.outerWidth(), 150);
    assert.deepEqual($contentBox.outerWidth(true), 170);

    $contentBox.outerHeight(null);
    assert.deepEqual($contentBox.height(), 200);
    assert.deepEqual($contentBox.innerHeight(), 240);
    assert.deepEqual($contentBox.outerHeight(), 250);
    assert.deepEqual($contentBox.outerHeight(true), 270);

    $contentBox.outerWidth(undefined, true);
    assert.deepEqual($contentBox.width(), 100);
    assert.deepEqual($contentBox.innerWidth(), 140);
    assert.deepEqual($contentBox.outerWidth(), 150);
    assert.deepEqual($contentBox.outerWidth(true), 170);

    $contentBox.outerHeight(undefined, true);
    assert.deepEqual($contentBox.height(), 200);
    assert.deepEqual($contentBox.innerHeight(), 240);
    assert.deepEqual($contentBox.outerHeight(), 250);
    assert.deepEqual($contentBox.outerHeight(true), 270);
  });

  it('.width(callback)', function () {
    // 通过回调函数设置 box-sizing: border-box 的值
    const $borderBox = $('#border-box');

    // .width()
    const _widthThiss: HTMLElement[] = [];
    const _widthIndexs: number[] = [];
    const _widthValues: number[] = [];

    $borderBox.width(function (index, oldValue) {
      _widthThiss.push(this);
      _widthIndexs.push(index);
      _widthValues.push(oldValue);

      return oldValue + 10;
    });

    assert.sameOrderedMembers(_widthThiss, $borderBox.get());
    assert.sameOrderedMembers(_widthIndexs, [0]);
    assert.sameOrderedMembers(_widthValues, [50]);
    assert.deepEqual($borderBox.width(), 60);
    assert.deepEqual($borderBox.innerWidth(), 100);
    assert.deepEqual($borderBox.outerWidth(), 110);
    assert.deepEqual($borderBox.outerWidth(true), 130);

    // .height()
    const _heightThiss: HTMLElement[] = [];
    const _heightIndexs: number[] = [];
    const _heightValues: number[] = [];

    $borderBox.height(function (index, oldValue) {
      _heightThiss.push(this);
      _heightIndexs.push(index);
      _heightValues.push(oldValue);

      return oldValue + 10;
    });

    assert.sameOrderedMembers(_heightThiss, $borderBox.get());
    assert.sameOrderedMembers(_heightIndexs, [0]);
    assert.sameOrderedMembers(_heightValues, [150]);
    assert.deepEqual($borderBox.height(), 160);
    assert.deepEqual($borderBox.innerHeight(), 200);
    assert.deepEqual($borderBox.outerHeight(), 210);
    assert.deepEqual($borderBox.outerHeight(true), 230);

    // .innerWidth()
    const _innerWidthThiss: HTMLElement[] = [];
    const _innerWidthIndexs: number[] = [];
    const _innerWidthValues: number[] = [];

    $borderBox.innerWidth(function (index, oldValue) {
      _innerWidthThiss.push(this);
      _innerWidthIndexs.push(index);
      _innerWidthValues.push(oldValue);

      return oldValue + 10;
    });

    assert.sameOrderedMembers(_innerWidthThiss, $borderBox.get());
    assert.sameOrderedMembers(_innerWidthIndexs, [0]);
    assert.sameOrderedMembers(_innerWidthValues, [100]);
    assert.deepEqual($borderBox.width(), 70);
    assert.deepEqual($borderBox.innerWidth(), 110);
    assert.deepEqual($borderBox.outerWidth(), 120);
    assert.deepEqual($borderBox.outerWidth(true), 140);

    // .innerHeight()
    const _innerHeightThiss: HTMLElement[] = [];
    const _innerHeightIndexs: number[] = [];
    const _innerHeightValues: number[] = [];

    $borderBox.innerHeight(function (index, oldValue) {
      _innerHeightThiss.push(this);
      _innerHeightIndexs.push(index);
      _innerHeightValues.push(oldValue);

      return oldValue + 10;
    });

    assert.sameOrderedMembers(_innerHeightThiss, $borderBox.get());
    assert.sameOrderedMembers(_innerHeightIndexs, [0]);
    assert.sameOrderedMembers(_innerHeightValues, [200]);
    assert.deepEqual($borderBox.height(), 170);
    assert.deepEqual($borderBox.innerHeight(), 210);
    assert.deepEqual($borderBox.outerHeight(), 220);
    assert.deepEqual($borderBox.outerHeight(true), 240);

    // .outerWidth()
    const _outerWidthThiss: HTMLElement[] = [];
    const _outerWidthIndexs: number[] = [];
    const _outerWidthValues: number[] = [];

    $borderBox.outerWidth(function (index, oldValue) {
      _outerWidthThiss.push(this);
      _outerWidthIndexs.push(index);
      _outerWidthValues.push(oldValue);

      return oldValue + 10;
    });

    assert.sameOrderedMembers(_outerWidthThiss, $borderBox.get());
    assert.sameOrderedMembers(_outerWidthIndexs, [0]);
    assert.sameOrderedMembers(_outerWidthValues, [120]);
    assert.deepEqual($borderBox.width(), 80);
    assert.deepEqual($borderBox.innerWidth(), 120);
    assert.deepEqual($borderBox.outerWidth(), 130);
    assert.deepEqual($borderBox.outerWidth(true), 150);

    // .outerHeight()
    const _outerHeightThiss: HTMLElement[] = [];
    const _outerHeightIndexs: number[] = [];
    const _outerHeightValues: number[] = [];

    $borderBox.outerHeight(function (index, oldValue) {
      _outerHeightThiss.push(this);
      _outerHeightIndexs.push(index);
      _outerHeightValues.push(oldValue);

      return oldValue + 10;
    });

    assert.sameOrderedMembers(_outerHeightThiss, $borderBox.get());
    assert.sameOrderedMembers(_outerHeightIndexs, [0]);
    assert.sameOrderedMembers(_outerHeightValues, [220]);
    assert.deepEqual($borderBox.height(), 180);
    assert.deepEqual($borderBox.innerHeight(), 220);
    assert.deepEqual($borderBox.outerHeight(), 230);
    assert.deepEqual($borderBox.outerHeight(true), 250);

    // .outerWidth(true)
    const _outerWidthMarginThiss: HTMLElement[] = [];
    const _outerWidthMarginIndexs: number[] = [];
    const _outerWidthMarginValues: number[] = [];

    $borderBox.outerWidth(function (index, oldValue) {
      _outerWidthMarginThiss.push(this);
      _outerWidthMarginIndexs.push(index);
      _outerWidthMarginValues.push(oldValue);

      return oldValue + 10;
    }, true);

    assert.sameOrderedMembers(_outerWidthMarginThiss, $borderBox.get());
    assert.sameOrderedMembers(_outerWidthMarginIndexs, [0]);
    assert.sameOrderedMembers(_outerWidthMarginValues, [150]);
    assert.deepEqual($borderBox.width(), 90);
    assert.deepEqual($borderBox.innerWidth(), 130);
    assert.deepEqual($borderBox.outerWidth(), 140);
    assert.deepEqual($borderBox.outerWidth(true), 160);

    // .outerHeight(true)
    const _outerHeightMarginThiss: HTMLElement[] = [];
    const _outerHeightMarginIndexs: number[] = [];
    const _outerHeightMarginValues: number[] = [];

    $borderBox.outerHeight(function (index, oldValue) {
      _outerHeightMarginThiss.push(this);
      _outerHeightMarginIndexs.push(index);
      _outerHeightMarginValues.push(oldValue);

      return oldValue + 10;
    }, true);

    assert.sameOrderedMembers(_outerHeightMarginThiss, $borderBox.get());
    assert.sameOrderedMembers(_outerHeightMarginIndexs, [0]);
    assert.sameOrderedMembers(_outerHeightMarginValues, [250]);
    assert.deepEqual($borderBox.height(), 190);
    assert.deepEqual($borderBox.innerHeight(), 230);
    assert.deepEqual($borderBox.outerHeight(), 240);
    assert.deepEqual($borderBox.outerHeight(true), 260);

    // .width(null)
    $borderBox.width(function () {
      return null;
    });
    assert.deepEqual($borderBox.width(), 90);
    assert.deepEqual($borderBox.innerWidth(), 130);
    assert.deepEqual($borderBox.outerWidth(), 140);
    assert.deepEqual($borderBox.outerWidth(true), 160);

    // .height(null)
    $borderBox.height(function () {
      return null;
    });
    assert.deepEqual($borderBox.height(), 190);
    assert.deepEqual($borderBox.innerHeight(), 230);
    assert.deepEqual($borderBox.outerHeight(), 240);
    assert.deepEqual($borderBox.outerHeight(true), 260);

    // .width(undefined)
    $borderBox.width(function () {
      return undefined;
    });
    assert.deepEqual($borderBox.width(), 90);
    assert.deepEqual($borderBox.innerWidth(), 130);
    assert.deepEqual($borderBox.outerWidth(), 140);
    assert.deepEqual($borderBox.outerWidth(true), 160);

    // .height(undefined)
    $borderBox.height(function () {
      return undefined;
    });
    assert.deepEqual($borderBox.height(), 190);
    assert.deepEqual($borderBox.innerHeight(), 230);
    assert.deepEqual($borderBox.outerHeight(), 240);
    assert.deepEqual($borderBox.outerHeight(true), 260);
  });
});
