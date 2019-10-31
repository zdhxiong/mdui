import $ from '../../jq_or_jquery';

// 测试 width、height、innerWidth、innerHeight、outerWidth、outerHeight
describe('.width()', function() {
  beforeEach(function() {
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

  it('$().width()', function() {
    chai.assert.isUndefined($().width());
    chai.assert.isUndefined($().innerWidth());
    chai.assert.isUndefined($().outerWidth());
    chai.assert.isUndefined($().outerWidth(true));

    chai.assert.isUndefined($().height());
    chai.assert.isUndefined($().innerHeight());
    chai.assert.isUndefined($().outerHeight());
    chai.assert.isUndefined($().outerHeight(true));
  });

  it('.width()', function() {
    // box-sizing: border-box
    const $borderBox = $('#border-box');

    chai.assert.deepEqual($borderBox.width(), 50);
    chai.assert.deepEqual($borderBox.height(), 150);
    chai.assert.deepEqual($borderBox.innerWidth(), 90);
    chai.assert.deepEqual($borderBox.innerHeight(), 190);
    chai.assert.deepEqual($borderBox.outerWidth(), 100);
    chai.assert.deepEqual($borderBox.outerHeight(), 200);
    chai.assert.deepEqual($borderBox.outerWidth(true), 120);
    chai.assert.deepEqual($borderBox.outerHeight(true), 220);
  });

  it('.width()', function() {
    // box-sizing: content-box
    const $contentBox = $('#content-box');

    chai.assert.deepEqual($contentBox.width(), 100);
    chai.assert.deepEqual($contentBox.height(), 200);
    chai.assert.deepEqual($contentBox.innerWidth(), 140);
    chai.assert.deepEqual($contentBox.innerHeight(), 240);
    chai.assert.deepEqual($contentBox.outerWidth(), 150);
    chai.assert.deepEqual($contentBox.outerHeight(), 250);
    chai.assert.deepEqual($contentBox.outerWidth(true), 170);
    chai.assert.deepEqual($contentBox.outerHeight(true), 270);
  });

  it('.width()', function() {
    // box-sizing: border-box 的子元素
    const $borderBoxInner = $('#border-box-inner');

    chai.assert.deepEqual($borderBoxInner.width(), 25);
    chai.assert.deepEqual($borderBoxInner.height(), 75);
    chai.assert.deepEqual($borderBoxInner.innerWidth(), 35);
    chai.assert.deepEqual($borderBoxInner.innerHeight(), 85);
    chai.assert.deepEqual($borderBoxInner.outerWidth(), 35);
    chai.assert.deepEqual($borderBoxInner.outerHeight(), 85);
    chai.assert.deepEqual($borderBoxInner.outerWidth(true), 39);
    chai.assert.deepEqual($borderBoxInner.outerHeight(true), 89);
  });

  it('.width()', function() {
    // box-sizing: content-box 的子元素
    const $contentBoxInner = $('#content-box-inner');

    chai.assert.deepEqual($contentBoxInner.width(), 50);
    chai.assert.deepEqual($contentBoxInner.height(), 100);
    chai.assert.deepEqual($contentBoxInner.innerWidth(), 70);
    chai.assert.deepEqual($contentBoxInner.innerHeight(), 120);
    chai.assert.deepEqual($contentBoxInner.outerWidth(), 70);
    chai.assert.deepEqual($contentBoxInner.outerHeight(), 120);
    chai.assert.deepEqual($contentBoxInner.outerWidth(true), 78);
    chai.assert.deepEqual($contentBoxInner.outerHeight(true), 128);
  });

  it('$(window).width()', function() {
    const $window = $(window);
    const windowWidth = document.documentElement.clientWidth;
    const innerWidth = window.innerWidth;

    chai.assert.deepEqual($window.width(), windowWidth);
    chai.assert.deepEqual($window.innerWidth(), windowWidth);
    chai.assert.deepEqual($window.outerWidth(), innerWidth);
    chai.assert.deepEqual($window.outerWidth(true), innerWidth);

    const windowHeight = document.documentElement.clientHeight;
    const innerHeight = window.innerHeight;

    chai.assert.deepEqual($window.height(), windowHeight);
    chai.assert.deepEqual($window.innerHeight(), windowHeight);
    chai.assert.deepEqual($window.outerHeight(), innerHeight);
    chai.assert.deepEqual($window.outerHeight(true), innerHeight);
  });

  it('$(document).width()', function() {
    const $document = $(document);
    const documentWidth = Math.max(
      document.body.scrollWidth,
      document.documentElement.scrollWidth,
      document.body.offsetWidth,
      document.documentElement.offsetWidth,
      document.documentElement.clientWidth,
    );

    chai.assert.deepEqual($document.width(), documentWidth);
    chai.assert.deepEqual($document.innerWidth(), documentWidth);
    chai.assert.deepEqual($document.outerWidth(), documentWidth);
    chai.assert.deepEqual($document.outerWidth(true), documentWidth);

    const documentHeight = Math.max(
      document.body.scrollHeight,
      document.documentElement.scrollHeight,
      document.body.offsetHeight,
      document.documentElement.offsetHeight,
      document.documentElement.clientHeight,
    );

    chai.assert.deepEqual($document.height(), documentHeight);
    chai.assert.deepEqual($document.innerHeight(), documentHeight);
    chai.assert.deepEqual($document.outerHeight(), documentHeight);
    chai.assert.deepEqual($document.outerHeight(true), documentHeight);
  });

  it('.width(value)', function() {
    // 设置 box-sizing: border-box 的值
    const $borderBox = $('#border-box');

    $borderBox.width(10);
    chai.assert.deepEqual($borderBox.width(), 10);
    chai.assert.deepEqual($borderBox.innerWidth(), 50);
    chai.assert.deepEqual($borderBox.outerWidth(), 60);
    chai.assert.deepEqual($borderBox.outerWidth(true), 80);

    $borderBox.height(30);
    chai.assert.deepEqual($borderBox.height(), 30);
    chai.assert.deepEqual($borderBox.innerHeight(), 70);
    chai.assert.deepEqual($borderBox.outerHeight(), 80);
    chai.assert.deepEqual($borderBox.outerHeight(true), 100);

    $borderBox.innerWidth('100');
    chai.assert.deepEqual($borderBox.width(), 60);
    chai.assert.deepEqual($borderBox.innerWidth(), 100);
    chai.assert.deepEqual($borderBox.outerWidth(), 110);
    chai.assert.deepEqual($borderBox.outerWidth(true), 130);

    $borderBox.innerHeight('300');
    chai.assert.deepEqual($borderBox.height(), 260);
    chai.assert.deepEqual($borderBox.innerHeight(), 300);
    chai.assert.deepEqual($borderBox.outerHeight(), 310);
    chai.assert.deepEqual($borderBox.outerHeight(true), 330);

    $borderBox.outerWidth('100px');
    chai.assert.deepEqual($borderBox.width(), 50);
    chai.assert.deepEqual($borderBox.innerWidth(), 90);
    chai.assert.deepEqual($borderBox.outerWidth(), 100);
    chai.assert.deepEqual($borderBox.outerWidth(true), 120);

    $borderBox.outerHeight('300px');
    chai.assert.deepEqual($borderBox.height(), 250);
    chai.assert.deepEqual($borderBox.innerHeight(), 290);
    chai.assert.deepEqual($borderBox.outerHeight(), 300);
    chai.assert.deepEqual($borderBox.outerHeight(true), 320);

    $borderBox.outerWidth('100px', true);
    chai.assert.deepEqual($borderBox.width(), 30);
    chai.assert.deepEqual($borderBox.innerWidth(), 70);
    chai.assert.deepEqual($borderBox.outerWidth(), 80);
    chai.assert.deepEqual($borderBox.outerWidth(true), 100);

    $borderBox.outerHeight('300px', true);
    chai.assert.deepEqual($borderBox.height(), 230);
    chai.assert.deepEqual($borderBox.innerHeight(), 270);
    chai.assert.deepEqual($borderBox.outerHeight(), 280);
    chai.assert.deepEqual($borderBox.outerHeight(true), 300);

    const $borderBoxInner = $('#border-box-inner');

    $borderBoxInner.width('10%');
    chai.assert.deepEqual($borderBoxInner.width(), 3);
    chai.assert.deepEqual($borderBoxInner.innerWidth(), 9);
    chai.assert.deepEqual($borderBoxInner.outerWidth(), 9);
    chai.assert.deepEqual($borderBoxInner.outerWidth(true), 11.4);

    $borderBoxInner.height('20%');
    chai.assert.deepEqual($borderBoxInner.height(), 46);
    chai.assert.deepEqual($borderBoxInner.innerHeight(), 52);
    chai.assert.deepEqual($borderBoxInner.outerHeight(), 52);
    chai.assert.deepEqual($borderBoxInner.outerHeight(true), 54.4);
  });

  it('.width(value)', function() {
    // 设置 box-sizing: content-box 的值
    const $contentBox = $('#content-box');

    $contentBox.width(10);
    chai.assert.deepEqual($contentBox.width(), 10);
    chai.assert.deepEqual($contentBox.innerWidth(), 50);
    chai.assert.deepEqual($contentBox.outerWidth(), 60);
    chai.assert.deepEqual($contentBox.outerWidth(true), 80);

    $contentBox.height(20);
    chai.assert.deepEqual($contentBox.height(), 20);
    chai.assert.deepEqual($contentBox.innerHeight(), 60);
    chai.assert.deepEqual($contentBox.outerHeight(), 70);
    chai.assert.deepEqual($contentBox.outerHeight(true), 90);

    $contentBox.innerWidth('100');
    chai.assert.deepEqual($contentBox.width(), 60);
    chai.assert.deepEqual($contentBox.innerWidth(), 100);
    chai.assert.deepEqual($contentBox.outerWidth(), 110);
    chai.assert.deepEqual($contentBox.outerWidth(true), 130);

    $contentBox.innerHeight('300');
    chai.assert.deepEqual($contentBox.height(), 260);
    chai.assert.deepEqual($contentBox.innerHeight(), 300);
    chai.assert.deepEqual($contentBox.outerHeight(), 310);
    chai.assert.deepEqual($contentBox.outerHeight(true), 330);

    $contentBox.outerWidth('100px');
    chai.assert.deepEqual($contentBox.width(), 50);
    chai.assert.deepEqual($contentBox.innerWidth(), 90);
    chai.assert.deepEqual($contentBox.outerWidth(), 100);
    chai.assert.deepEqual($contentBox.outerWidth(true), 120);

    $contentBox.outerHeight('300px');
    chai.assert.deepEqual($contentBox.height(), 250);
    chai.assert.deepEqual($contentBox.innerHeight(), 290);
    chai.assert.deepEqual($contentBox.outerHeight(), 300);
    chai.assert.deepEqual($contentBox.outerHeight(true), 320);

    $contentBox.outerWidth('100px', true);
    chai.assert.deepEqual($contentBox.width(), 30);
    chai.assert.deepEqual($contentBox.innerWidth(), 70);
    chai.assert.deepEqual($contentBox.outerWidth(), 80);
    chai.assert.deepEqual($contentBox.outerWidth(true), 100);

    $contentBox.outerHeight('300px', true);
    chai.assert.deepEqual($contentBox.height(), 230);
    chai.assert.deepEqual($contentBox.innerHeight(), 270);
    chai.assert.deepEqual($contentBox.outerHeight(), 280);
    chai.assert.deepEqual($contentBox.outerHeight(true), 300);
  });

  it('.width(null | undefined)', function() {
    // 设置 box-sizing: border-box 的值
    const $borderBox = $('#border-box');

    $borderBox.width(null);
    chai.assert.deepEqual($borderBox.width(), 50);
    chai.assert.deepEqual($borderBox.innerWidth(), 90);
    chai.assert.deepEqual($borderBox.outerWidth(), 100);
    chai.assert.deepEqual($borderBox.outerWidth(true), 120);

    $borderBox.height(null);
    chai.assert.deepEqual($borderBox.height(), 150);
    chai.assert.deepEqual($borderBox.innerHeight(), 190);
    chai.assert.deepEqual($borderBox.outerHeight(), 200);
    chai.assert.deepEqual($borderBox.outerHeight(true), 220);

    $borderBox.innerWidth(undefined);
    chai.assert.deepEqual($borderBox.width(), 50);
    chai.assert.deepEqual($borderBox.innerWidth(), 90);
    chai.assert.deepEqual($borderBox.outerWidth(), 100);
    chai.assert.deepEqual($borderBox.outerWidth(true), 120);

    $borderBox.innerHeight(undefined);
    chai.assert.deepEqual($borderBox.height(), 150);
    chai.assert.deepEqual($borderBox.innerHeight(), 190);
    chai.assert.deepEqual($borderBox.outerHeight(), 200);
    chai.assert.deepEqual($borderBox.outerHeight(true), 220);

    $borderBox.outerWidth(null);
    chai.assert.deepEqual($borderBox.width(), 50);
    chai.assert.deepEqual($borderBox.innerWidth(), 90);
    chai.assert.deepEqual($borderBox.outerWidth(), 100);
    chai.assert.deepEqual($borderBox.outerWidth(true), 120);

    $borderBox.outerHeight(null);
    chai.assert.deepEqual($borderBox.height(), 150);
    chai.assert.deepEqual($borderBox.innerHeight(), 190);
    chai.assert.deepEqual($borderBox.outerHeight(), 200);
    chai.assert.deepEqual($borderBox.outerHeight(true), 220);

    $borderBox.outerWidth(undefined, true);
    chai.assert.deepEqual($borderBox.width(), 50);
    chai.assert.deepEqual($borderBox.innerWidth(), 90);
    chai.assert.deepEqual($borderBox.outerWidth(), 100);
    chai.assert.deepEqual($borderBox.outerWidth(true), 120);

    $borderBox.outerHeight(undefined, true);
    chai.assert.deepEqual($borderBox.height(), 150);
    chai.assert.deepEqual($borderBox.innerHeight(), 190);
    chai.assert.deepEqual($borderBox.outerHeight(), 200);
    chai.assert.deepEqual($borderBox.outerHeight(true), 220);
  });

  it('.width(null | undefined)', function() {
    // 设置 box-sizing: content-box 的值
    const $contentBox = $('#content-box');

    $contentBox.width(null);
    chai.assert.deepEqual($contentBox.width(), 100);
    chai.assert.deepEqual($contentBox.innerWidth(), 140);
    chai.assert.deepEqual($contentBox.outerWidth(), 150);
    chai.assert.deepEqual($contentBox.outerWidth(true), 170);

    $contentBox.height(null);
    chai.assert.deepEqual($contentBox.height(), 200);
    chai.assert.deepEqual($contentBox.innerHeight(), 240);
    chai.assert.deepEqual($contentBox.outerHeight(), 250);
    chai.assert.deepEqual($contentBox.outerHeight(true), 270);

    $contentBox.innerWidth(undefined);
    chai.assert.deepEqual($contentBox.width(), 100);
    chai.assert.deepEqual($contentBox.innerWidth(), 140);
    chai.assert.deepEqual($contentBox.outerWidth(), 150);
    chai.assert.deepEqual($contentBox.outerWidth(true), 170);

    $contentBox.innerHeight(undefined);
    chai.assert.deepEqual($contentBox.height(), 200);
    chai.assert.deepEqual($contentBox.innerHeight(), 240);
    chai.assert.deepEqual($contentBox.outerHeight(), 250);
    chai.assert.deepEqual($contentBox.outerHeight(true), 270);

    $contentBox.outerWidth(null);
    chai.assert.deepEqual($contentBox.width(), 100);
    chai.assert.deepEqual($contentBox.innerWidth(), 140);
    chai.assert.deepEqual($contentBox.outerWidth(), 150);
    chai.assert.deepEqual($contentBox.outerWidth(true), 170);

    $contentBox.outerHeight(null);
    chai.assert.deepEqual($contentBox.height(), 200);
    chai.assert.deepEqual($contentBox.innerHeight(), 240);
    chai.assert.deepEqual($contentBox.outerHeight(), 250);
    chai.assert.deepEqual($contentBox.outerHeight(true), 270);

    $contentBox.outerWidth(undefined, true);
    chai.assert.deepEqual($contentBox.width(), 100);
    chai.assert.deepEqual($contentBox.innerWidth(), 140);
    chai.assert.deepEqual($contentBox.outerWidth(), 150);
    chai.assert.deepEqual($contentBox.outerWidth(true), 170);

    $contentBox.outerHeight(undefined, true);
    chai.assert.deepEqual($contentBox.height(), 200);
    chai.assert.deepEqual($contentBox.innerHeight(), 240);
    chai.assert.deepEqual($contentBox.outerHeight(), 250);
    chai.assert.deepEqual($contentBox.outerHeight(true), 270);
  });

  it('.width(callback)', function() {
    // 通过回调函数设置 box-sizing: border-box 的值
    const $borderBox = $('#border-box');

    // .width()
    const _widthThiss: HTMLElement[] = [];
    const _widthIndexs: number[] = [];
    const _widthValues: number[] = [];

    $borderBox.width(function(index, oldValue) {
      _widthThiss.push(this);
      _widthIndexs.push(index);
      _widthValues.push(oldValue);

      return oldValue + 10;
    });

    chai.assert.sameOrderedMembers(_widthThiss, $borderBox.get());
    chai.assert.sameOrderedMembers(_widthIndexs, [0]);
    chai.assert.sameOrderedMembers(_widthValues, [50]);
    chai.assert.deepEqual($borderBox.width(), 60);
    chai.assert.deepEqual($borderBox.innerWidth(), 100);
    chai.assert.deepEqual($borderBox.outerWidth(), 110);
    chai.assert.deepEqual($borderBox.outerWidth(true), 130);

    // .innerWidth()
    const _innerWidthThiss: HTMLElement[] = [];
    const _innerWidthIndexs: number[] = [];
    const _innerWidthValues: number[] = [];

    $borderBox.innerWidth(function(index, oldValue) {
      _innerWidthThiss.push(this);
      _innerWidthIndexs.push(index);
      _innerWidthValues.push(oldValue);

      return oldValue + 10;
    });

    chai.assert.sameOrderedMembers(_innerWidthThiss, $borderBox.get());
    chai.assert.sameOrderedMembers(_innerWidthIndexs, [0]);
    chai.assert.sameOrderedMembers(_innerWidthValues, [100]);
    chai.assert.deepEqual($borderBox.width(), 70);
    chai.assert.deepEqual($borderBox.innerWidth(), 110);
    chai.assert.deepEqual($borderBox.outerWidth(), 120);
    chai.assert.deepEqual($borderBox.outerWidth(true), 140);

    // .outerWidth()
    const _outerWidthThiss: HTMLElement[] = [];
    const _outerWidthIndexs: number[] = [];
    const _outerWidthValues: number[] = [];

    $borderBox.outerWidth(function(index, oldValue) {
      _outerWidthThiss.push(this);
      _outerWidthIndexs.push(index);
      _outerWidthValues.push(oldValue);

      return oldValue + 10;
    });

    chai.assert.sameOrderedMembers(_outerWidthThiss, $borderBox.get());
    chai.assert.sameOrderedMembers(_outerWidthIndexs, [0]);
    chai.assert.sameOrderedMembers(_outerWidthValues, [120]);
    chai.assert.deepEqual($borderBox.width(), 80);
    chai.assert.deepEqual($borderBox.innerWidth(), 120);
    chai.assert.deepEqual($borderBox.outerWidth(), 130);
    chai.assert.deepEqual($borderBox.outerWidth(true), 150);

    // .outerWidth(true)
    const _outerWidthMarginThiss: HTMLElement[] = [];
    const _outerWidthMarginIndexs: number[] = [];
    const _outerWidthMarginValues: number[] = [];

    $borderBox.outerWidth(function(index, oldValue) {
      _outerWidthMarginThiss.push(this);
      _outerWidthMarginIndexs.push(index);
      _outerWidthMarginValues.push(oldValue);

      return oldValue + 10;
    }, true);

    chai.assert.sameOrderedMembers(_outerWidthMarginThiss, $borderBox.get());
    chai.assert.sameOrderedMembers(_outerWidthMarginIndexs, [0]);
    chai.assert.sameOrderedMembers(_outerWidthMarginValues, [150]);
    chai.assert.deepEqual($borderBox.width(), 90);
    chai.assert.deepEqual($borderBox.innerWidth(), 130);
    chai.assert.deepEqual($borderBox.outerWidth(), 140);
    chai.assert.deepEqual($borderBox.outerWidth(true), 160);

    // .width(null)
    $borderBox.width(function() {
      return null;
    });
    chai.assert.deepEqual($borderBox.width(), 90);
    chai.assert.deepEqual($borderBox.innerWidth(), 130);
    chai.assert.deepEqual($borderBox.outerWidth(), 140);
    chai.assert.deepEqual($borderBox.outerWidth(true), 160);

    // .width(undefined)
    $borderBox.width(function() {
      return undefined;
    });
    chai.assert.deepEqual($borderBox.width(), 90);
    chai.assert.deepEqual($borderBox.innerWidth(), 130);
    chai.assert.deepEqual($borderBox.outerWidth(), 140);
    chai.assert.deepEqual($borderBox.outerWidth(true), 160);
  });
});
