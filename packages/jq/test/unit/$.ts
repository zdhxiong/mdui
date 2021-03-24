import { assert } from 'chai';
import $ from '../jq_or_jquery';

describe('$()', function () {
  beforeEach(function () {
    $('#test').html(`
<div id="testid">a</div>
<div class="testclass">b</div>
<span class="testclass">c</span>
<span id="span1">d</span>
<span id="span2">e</span>
<label>f</label>
`);
  });

  it('$()', function () {
    const $jqEmpty = $();
    assert.lengthOf($jqEmpty, 0);

    const $jqNull = $(null);
    assert.lengthOf($jqNull, 0);
  });

  it('$(window)', function () {
    const $window = $(window);
    assert.lengthOf($window, 1);
    assert.deepEqual($window[0], window);
  });

  it('$(document)', function () {
    const $document = $(document);
    assert.lengthOf($document, 1);
    assert.deepEqual($document[0], document);
  });

  it('$(element)', function () {
    const $element = $(document.getElementById('testid'));
    assert.lengthOf($element, 1);
    assert.deepEqual($element[0], document.getElementById('testid'));
  });

  it('$(elementArray)', function () {
    const nodeList = document.querySelectorAll('.testclass');
    const nodes = [];
    for (let i = 0; i < nodeList.length; i++) {
      nodes.push(nodeList[i]);
    }
    const $elements = $(nodes);
    assert.lengthOf($elements, 2);
    assert.sameOrderedMembers($elements.get(), nodes);
  });

  it('$(html)', function () {
    const $htmlElement = $('<div><p>Hello</p></div><span>test</span>');
    assert.lengthOf($htmlElement, 2);
    assert.equal($htmlElement[0].outerHTML, '<div><p>Hello</p></div>');
    assert.equal($htmlElement[1].outerHTML, '<span>test</span>');
  });

  it('$(id_selector)', function () {
    const $id = $('#testid');
    assert.lengthOf($id, 1);
    assert.deepEqual($id[0], document.getElementById('testid'));
  });

  it('$(class_selector)', function () {
    const $class = $('.testclass');
    assert.lengthOf($class, 2);
    assert.deepEqual($class[0], document.querySelectorAll('.testclass')[0]);
    assert.deepEqual($class[1], document.querySelectorAll('.testclass')[1]);
    assert.notDeepEqual($class[0], document.querySelectorAll('.testclass')[1]);
  });

  it('$(tag_selector)', function () {
    const $tag = $('#test span');
    assert.lengthOf($tag, 3);

    const nodeList = document.querySelectorAll('#test span');
    const nodes = [];
    for (let i = 0; i < nodeList.length; i++) {
      nodes.push(nodeList[i]);
    }
    assert.sameOrderedMembers($tag.get(), nodes);
  });

  it('$(multiple_selector)', function () {
    const $elements = $('#testid, .testclass,#test label');

    assert.lengthOf($elements, 4);
    assert.equal($elements.text(), 'abcf');
  });

  it('$(nodeList)', function () {
    const nodeList = document.querySelectorAll('.testclass');
    const nodes = [];
    for (let i = 0; i < nodeList.length; i++) {
      nodes.push(nodeList[i]);
    }

    const $nodeList = $(nodeList);
    assert.lengthOf($nodeList, 2);
    assert.sameOrderedMembers($nodeList.get(), nodes);
  });

  it('$($elements)', function () {
    const $class = $('.testclass');
    const $jq = $($class);
    // jquery 中两个对象不相同，但包含的元素相同；mdui.jq 中两个对象完全相同
    assert.sameOrderedMembers($class.get(), $jq.get());
  });

  it('$(callback)', function () {
    const $fc = $(function (_$) {
      assert.equal(this, document);
      assert.equal($, _$);
    });

    assert.lengthOf($fc, 1);
    assert.deepEqual($fc[0], document);
  });

  it('$(not_found)', function () {
    const $element = $('#test button');
    assert.lengthOf($element, 0);

    const $selector = $('.not-found');
    assert.lengthOf($selector, 0);
  });

  it('$(object)', function () {
    const obj = {
      a: 'aa',
      b: 11,
      c: [1, 2],
    };

    const $jq = $(obj);
    assert.deepEqual($jq[0], obj);
  });

  it('$(array)', function () {
    const arr = [
      'str',
      123,
      [1, '2'],
      {
        a: 'aa',
        b: 11,
      },
      document.getElementById('testid'),
    ];

    const $jq = $(arr);
    // @ts-ignore
    assert.sameOrderedMembers($jq.get(), arr);
  });
});
