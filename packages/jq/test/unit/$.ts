import $ from '../jq_or_jquery';

describe('$()', function() {
  beforeEach(function() {
    $('#test').html(`
<div id="testid">a</div>
<div class="testclass">b</div>
<span class="testclass">c</span>
<span id="span1">d</span>
<span id="span2">e</span>
<label>f</label>
`);
  });

  it('$()', function() {
    const $jqEmpty = $();
    chai.assert.lengthOf($jqEmpty, 0);

    const $jqNull = $(null);
    chai.assert.lengthOf($jqNull, 0);
  });

  it('$(window)', function() {
    const $window = $(window);
    chai.assert.lengthOf($window, 1);
    chai.assert.deepEqual($window[0], window);
  });

  it('$(document)', function() {
    const $document = $(document);
    chai.assert.lengthOf($document, 1);
    chai.assert.deepEqual($document[0], document);
  });

  it('$(element)', function() {
    const $element = $(document.getElementById('testid'));
    chai.assert.lengthOf($element, 1);
    chai.assert.deepEqual($element[0], document.getElementById('testid'));
  });

  it('$(elementArray)', function() {
    const nodeList = document.querySelectorAll('.testclass');
    const nodes = [];
    for (let i = 0; i < nodeList.length; i++) {
      nodes.push(nodeList[i]);
    }
    const $elements = $(nodes);
    chai.assert.lengthOf($elements, 2);
    chai.assert.sameOrderedMembers($elements.get(), nodes);
  });

  it('$(html)', function() {
    const $htmlElement = $('<div><p>Hello</p></div><span>test</span>');
    chai.assert.lengthOf($htmlElement, 2);
    chai.assert.equal($htmlElement[0].outerHTML, '<div><p>Hello</p></div>');
    chai.assert.equal($htmlElement[1].outerHTML, '<span>test</span>');
  });

  it('$(id_selector)', function() {
    const $id = $('#testid');
    chai.assert.lengthOf($id, 1);
    chai.assert.deepEqual($id[0], document.getElementById('testid'));
  });

  it('$(class_selector)', function() {
    const $class = $('.testclass');
    chai.assert.lengthOf($class, 2);
    chai.assert.deepEqual(
      $class[0],
      document.querySelectorAll('.testclass')[0],
    );
    chai.assert.deepEqual(
      $class[1],
      document.querySelectorAll('.testclass')[1],
    );
    chai.assert.notDeepEqual(
      $class[0],
      document.querySelectorAll('.testclass')[1],
    );
  });

  it('$(tag_selector)', function() {
    const $tag = $('#test span');
    chai.assert.lengthOf($tag, 3);

    const nodeList = document.querySelectorAll('#test span');
    const nodes = [];
    for (let i = 0; i < nodeList.length; i++) {
      nodes.push(nodeList[i]);
    }
    chai.assert.sameOrderedMembers($tag.get(), nodes);
  });

  it('$(multiple_selector)', function() {
    const $elements = $('#testid, .testclass,#test label');

    chai.assert.lengthOf($elements, 4);
    chai.assert.equal($elements.text(), 'abcf');
  });

  it('$(nodeList)', function() {
    const nodeList = document.querySelectorAll('.testclass');
    const nodes = [];
    for (let i = 0; i < nodeList.length; i++) {
      nodes.push(nodeList[i]);
    }

    const $nodeList = $(nodeList);
    chai.assert.lengthOf($nodeList, 2);
    chai.assert.sameOrderedMembers($nodeList.get(), nodes);
  });

  it('$($elements)', function() {
    const $class = $('.testclass');
    const $jq = $($class);
    // jquery 中两个对象不相同，但包含的元素相同；mdui.jq 中两个对象完全相同
    chai.assert.sameOrderedMembers($class.get(), $jq.get());
  });

  it('$(callback)', function() {
    const $fc = $(function(_$) {
      chai.assert.equal(this, document);
      chai.assert.equal($, _$);
    });

    chai.assert.lengthOf($fc, 1);
    chai.assert.deepEqual($fc[0], document);
  });

  it('$(not_found)', function() {
    const $element = $('#test button');
    chai.assert.lengthOf($element, 0);

    const $selector = $('.not-found');
    chai.assert.lengthOf($selector, 0);
  });

  it('$(object)', function() {
    const obj = {
      a: 'aa',
      b: 11,
      c: [1, 2],
    };

    const $jq = $(obj);
    chai.assert.deepEqual($jq[0], obj);
  });

  it('$(array)', function() {
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
    chai.assert.sameOrderedMembers($jq.get(), arr);
  });
});
